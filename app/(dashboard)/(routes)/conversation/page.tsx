"use client"
import { useState } from 'react'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ChatCompletionRequestMessage } from 'openai'

import Heading from "@/components/heading"
import { MessageSquare } from "lucide-react"
import { useForm } from "react-hook-form"

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema } from "./constants"
import { Form, FormControl, FormField, FormItem, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Empty from '@/components/empty'
import Loader from '@/components/loader'
import { cn } from '@/lib/utils'
import UserAvatar from '@/components/user-avatar'
import BotAvatar from '@/components/bot-avatar'
import { useProModel } from '@/hooks/use-pro-model'
import { toast } from 'react-hot-toast'



const ConversationPage = () => {
    const proModel=useProModel()
    const router = useRouter()
    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])
    

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ''
        }
    })

    const isLoading = form.formState.isSubmitting;  //in form we have isLoading so no need to have useState for it.

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionRequestMessage = {
                role: "user",
                content: values.prompt
            } //Whatever we have written.
            const newMessages = [...messages, userMessage]

            const response = await axios.post('/api/conversation', {
                messages: newMessages
            })

            setMessages((curr) => [...curr, userMessage, response.data])

            form.reset()
        }
        catch (err:any) {
            //TO DO Open Pro Model -->Triggers specfic error when free trail over.
            if(err?.response?.status===403){
                proModel.onOpen()
            }
            else{
                toast.error('Something went wrong')
            }
            console.log(err)
        }
        finally {
            router.refresh()  //All of our server components are going to get updated.
        }
    }

    return (
        <div>
            <Heading title="Conversation" description="Open AI advanced conversation model" icon={MessageSquare} iconColor="text-violet-500" bgColor="bg-violet-500/10" />

            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">

                            <FormField name="prompt" render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                            disabled={isLoading} placeholder="Who is the greatest batsman ever?" {...field}
                                        />
                                    </FormControl>
                                </FormItem>

                            )} />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}> Generate</Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
                            <Loader />
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && (
                        <div>
                            <Empty label="No conversation started" />
                        </div>
                    )}
                    <div className='flex flex-col-reverse gap-y-4'>
                        {messages.map((el) => (
                            <div className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", el.role==='user' ? "bg-white border border-black/10" : "bg-muted")}
                                key={el.content} >

                                {el.role==='user' ? <UserAvatar/> : <BotAvatar/>} 
                                <p className='text-sm'> {el.content}</p>
                               

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConversationPage