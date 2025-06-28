import React from 'react';
import { Wrench, Clock, } from 'lucide-react';
import Image from 'next/image';
const ZeusMaintenance = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
            </div>
            {/* Main content */}
            <div className="relative z-10 max-w-md w-full">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                    {/* Zeus Icon with lightning animation */}
                    <div className="text-center mb-6">
                        <div className="relative inline-block">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Image
                                    src="/chatbot.svg"
                                    alt="chatrobot"
                                    width={40}
                                    height={40}
                                />

                            </div>

                            {/* Animated rings */}
                            <div className="absolute inset-0 w-20 h-20 mx-auto">
                                <div className="absolute inset-0 rounded-full border-2 border-yellow-400/30 animate-ping"></div>
                                <div className="absolute inset-0 rounded-full border-2 border-yellow-400/20 animate-ping delay-300"></div>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Zeus is Under Maintenance
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Our AI assistant is getting an upgrade
                        </p>
                    </div>
                    {/* Status indicators */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Wrench className="w-5 h-5 text-blue-400" />
                                <span className="text-white">System Updates</span>
                            </div>
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Clock className="w-5 h-5 text-green-400" />
                                <span className="text-white">Estimated Time</span>
                            </div>
                            <span className="text-green-400 font-medium">~2 days</span>
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-300 mb-2">
                            <span>Progress</span>
                            <span>65%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: '65%' }}></div>
                        </div>
                    </div>
                    {/* Message */}
                    <div className="text-center">
                        <p className="text-gray-300 mb-4">
                            We are making Zeus faster and smarter. Thank you for your patience!
                        </p>
                        {/* Action button */}

                    </div>
                </div>
                {/* Floating particles */}
                <div className="absolute -top-20 -left-10 w-4 h-4 bg-cyan-400 rounded-full opacity-60 animate-bounce delay-700"></div>
                <div className="absolute -top-10 right-20 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-bounce delay-1000"></div>
                <div className="absolute -bottom-16 left-16 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-bounce delay-500"></div>
                <div className="absolute -bottom-8 -right-12 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-bounce delay-300"></div>
            </div>
        </div>
    );
};
export default ZeusMaintenance;
