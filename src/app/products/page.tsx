import React from 'react'
import ProductCard from './ProductCard'
import { Toaster } from 'react-hot-toast'

const page = () => {
    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Our Product</h1>
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
            <ProductCard />
        </div>
    )
}

export default page