"use client"

import { useEffect } from "react"
import {Crisp} from 'crisp-sdk-web'

export const CrispChat=()=>{
    useEffect(()=>{
        Crisp.configure("6f283194-87d9-4d73-b3b6-54b84a98a298")
    },[])

    return null;
}