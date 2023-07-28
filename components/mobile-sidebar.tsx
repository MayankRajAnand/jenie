"use client"
import {useState, useEffect} from 'react'
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button" //using alias where @->root.
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"  //Realtive path
import Sidebar from "./sidebar"

interface MobileSidebarProps{
    apiLimitCount:number,
    isPro :boolean
}

const MobileSidebar = ({apiLimitCount=0, isPro=false}:MobileSidebarProps) => {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(()=>{
        setIsMounted(true)
    },[])
    if(!isMounted)
        return null

    return (
        <Sheet>
            <SheetTrigger>
            <Button variant='ghost' size='icon' className="md:hidden">
                <Menu></Menu>
            </Button>
            </SheetTrigger>
            <SheetContent side='left' className="p-0">
                <Sidebar apiLimitCount={apiLimitCount} isPro={isPro}/>
            </SheetContent>
        </Sheet>
    )
}

export default MobileSidebar