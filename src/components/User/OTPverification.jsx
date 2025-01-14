import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/Input";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { X } from "lucide-react";


export function OTPVerification({
    isOpen,
    onClose,
    onVerify,
    email,
    handleSignUp,
    onResend,
}){
    const [otp,setOtp]=useState(["","","","",""])
    const [timer,setTimer] =useState(120)
    const inputRefs=useRef([])
 
    useEffect(()=>{
       let interval
       if(isOpen && timer >0){
        interval = setInterval(()=>{
            setTimer((prevTimer)=>prevTimer-1)
        },1000)
       }  
       return ()=>clearInterval(interval)
    },[isOpen,timer])

    const handleChange=(index,value)=>{
        // Move focus to the next input
        if(value.length <=1){
            const newOtp=[...otp]
            newOtp[index]=value
            setOtp(newOtp)

                if(value !=="" && index<4){
                    inputRefs.current[index +1].focus()
                }
        }
    }

    const handleResendOtp=async()=>{
      await onResend()
      setOtp(["", "", "", "", ""])
      setTimer(120)
    }

    const handleKeyDown=(index,e)=>{
         // Move focus to the previous input when backspace is pressed on an empty input
        if(e.key=== "Backspace" && index > 0 && otp[index]===""){
            inputRefs.current[index-1].focus()
        }
    }

    const handleVerify=()=>{
        onVerify(otp.join(""))
    }


    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className='sm:max-w-[425px] bg-white opacity-80'style={{ marginLeft: '-9px' }}>
          <DialogHeader>
            <DialogTitle className='text-center font-bold text-black'>Verify OTP</DialogTitle>
            <DialogClose asChild>
              <Button
                variant='ghost'
                className='absolute right-0 top-0 rounded-sm opacity-0 ring-offset-background transition-opacity '
                onClick={onClose}>
                <X className='h-4 w-4' />
                <span className='sr-only'>Close</span>
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className='text-center mb-4 font-bold text-black'>
            We've sent an email with an activation code to your email {email}
          </div>
          <div className='flex justify-center space-x-2 mb-4'>
            {otp.map((digit, index) => (
              <input
                key={index}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className='w-12 h-12 text-center text-lg font-bold text-black border-2 border-black rounded'
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <div className='text-center mb-4'>
            {timer > 0 ? (
              <p>
                Send code again in{" "}
                {Math.floor(timer / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(timer % 60).toString().padStart(2, "0")}
              </p>
            ) : (
              <Button onClick={ handleResendOtp}
                variant='link'className="bg-blue-500 text-white">
                Resend
              </Button>
            )}
          </div>
          <Button onClick={handleVerify} className='w-full bg-black text-white'>
            Verify
          </Button>
        </DialogContent>
      </Dialog>
    )
}