import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { Configuration, OpenAIApi } from "openai"

import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit"
import { checkSubscription } from "@/lib/subscription"

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
    try {
        const {userId}=auth()  //Which user is requesting for the conversation 
        const body=await req.json()
        const {prompt, amount=1,resolution='512x512'}=body

        if(!userId){
            return new NextResponse("Unauthorized", {status:401})
        }

        if(!configuration.apiKey){
            return new NextResponse("OpenAi API Key not configured", {status:500})
        }

        if(!prompt){
            return new NextResponse("Please fill in the prompt", {status:400})
        }
        if(!amount){
            return new NextResponse("Please select the amount", {status:400})
        }
        if(!resolution){
            return new NextResponse("Please select the resolution", {status:400})
        }

        const freeTrial= await checkApiLimit()
        const isPro=await checkSubscription()
        console.log(freeTrial)
        if(!freeTrial && !isPro){
            return new NextResponse("Free trial has expired" , {status:403})
        }

        const response=await openai.createImage({
            prompt,
            n:parseInt(amount,10),
            size:resolution
        })

        await incrementApiLimit()

        return NextResponse.json(response.data.data)

    } catch (err) {
        console.log("Image error", err)
        return new NextResponse("Internal Error",{status:500})
    }
}