import { CheckCircle } from 'lucide-react'
import React from 'react'

const ConfirmationPage = () => {
    return (
        <div className="flex items-center h-screen max-w-7xl mx-auto">
            <div className="w-full bg-brown-primary p-6 rounded-3xl" >
                <div className="text-white text-center space-y-4">
                    <CheckCircle color='white' size={50} className="mx-auto" />
                    <span className="text-xl font-bold">Yay! Your order has been placed.</span>
                    <br />
                    <small>Your order would be delivered in the 30 mins atmost</small>
                </div>
            </div >
        </div >
    )
}

export default ConfirmationPage