const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User');

//1 - Redirect user to LinkedIn for authentication
router.get('/login', (req, res) => {
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI)}&scope=openid%20profile%20email&state=security_token%3D138r5719ru3e1%26url%3Dhttps://www.example.com/bar`;
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
        const tokenResponse = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
                redirect_uri: process.env.LINKEDIN_REDIRECT_URI
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        const accessToken = tokenResponse.data.access_token;
        const idToken = tokenResponse.data.id_token;

        //Decode ID token to get user info (JWT format)
        let userInfo = {};
        if (idToken) {
            try {
                const base64Url = idToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString('utf8'));
                userInfo = JSON.parse(jsonPayload);
            } catch (e) {
                console.error('Error decoding ID token:', e.message);
            }
        }

        //Fallback: Try to fetch from userinfo endpoint
        let userResponse;
        try {
            userResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            });
            userInfo = userResponse.data;
        } catch (e) {
            console.error('Error fetching userinfo:', e.message);
            // Continue with ID token data
        }

        // Extract user information from OpenID token or userinfo response
        const email = userInfo.email || userInfo.sub;
        const firstName = userInfo.given_name || 'User';
        const lastName = userInfo.family_name || '';

        if (!email) {
            return res.status(400).json({message: 'Could not get email from LinkedIn', userInfo});
        }

        //checks, creates or updates user in our DB
        let user = await User.findOne({where: {email}});
        if(!user){
            user = await User.create({
                email,
                firstName,
                lastName,
                password: 'linkedin_oauth_' + Math.random().toString(36) 
            });
        }

        //create simple session token
        const token = `${user.id}-${Date.now()}`;

        //redirect to frontend with token
        res.redirect(`http://localhost:3000/auth/callback?token=${token}&userId=${user.id}`);
    }  catch (error) {  
        console.error('LinkedIn OAuth error:', error.response?.data || error.message);
        res.status(500).json({message: 'Server error during LinkedIn authentication', error: error.response?.data || error.message});
    }


});

module.exports = router;