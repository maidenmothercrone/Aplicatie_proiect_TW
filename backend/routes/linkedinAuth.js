const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User');

//1 - Redirect user to LinkedIn for authentication
router.get('/login', (req, res) => {
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI)}&scope=openid%20profile%20email`;
    res.redirect(linkedinAuthUrl);
});

//2 - Handle LinkedIn callback
router.get('/callback', async (req, res) => {
    const {code, error} = req.query;
    if(error){
        return res.status(400).json({message: 'LinkedIn authentication failed', error});
    }   
    try {
        //Exchange code for access token
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', {
            grant_type: 'authorization_code',
            code,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            redirect_uri: process.env.LINKEDIN_REDIRECT_URI
        });
        const accessToken = tokenResponse.data.access_token;

        //Fetch user profile from LinkedIn
        const userResponse = await axios.get('https://api.linkedin.com/v2/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const linkedInUser = userResponse.data;
        const email = emailResponse.data.elements[0]['handle~'].emailAddress;

        //checks, creates or updates user in our DB
        let user = await User.findOne({where: {email}});
        if(!user){
            user = await User.create({
                email,
                firstName: linkedInUser.localizedFirstName,
                lastName: linkedInUser.localizedLastName,
                password: 'linkedin_oauth_' + Math.random().toString(36) 
            });
        }

        //create simple session token
        const token = `${user.id}-${Date.now()}`;

        //redirect to frontend with token
        res.redirect(`http://localhost:3000/auth/callback?token=${token}&userId=${user.id}`);
    }  catch (error) {  
        console.error('LinkedIn OAuth error:', error.message);
        res.status(500).json({message: 'Server error during LinkedIn authentication', error: error.message});
    }


});

module.exports = router;