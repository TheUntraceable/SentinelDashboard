const config = require("../../../config.json")
import NextAuth from "next-auth/next";
import DiscordProvider from "next-auth/providers/discord";

export default NextAuth({
    providers: [
        new DiscordProvider({
            clientId: config.clientId,
            clientSecret: config.clientSecret, 
        })
    ]
})