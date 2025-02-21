import { Skeleton } from "@/components/ui/skeleton"



export function HeroSkeleton() {
    return (
        <section className="mx-auto w-[90%]">
            <div>
                <div
                    className="relative md:h-[80vh] h-[90%] flex justify-center items-center text-center rounded-2xl bg-cover bg-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-100"></div>
                    <div>
                        <div className="w-[100%] grid grid-cols-1 md:grid-cols-2 md:gap-44 gap-2 items-start ml-3 sm:ml-0 py-4 sm:py-12 relative z-10 px-4">
                            {/* Left Section - Properly Left-Aligned */}
                            <div className="md:space-y-2 w-full md:w-auto flex flex-col items-start">
                                <Skeleton className="border-2 h-12 w-[80%] mb-2 bg-slate-200" />

                                <div className="w-[100px] h-[100px] p-2 bg-white bg-opacity-10 rounded-lg flex items-center justify-start">
                                    <Skeleton className="w-full h-full rounded-full" />
                                </div>

                                <Skeleton className="w-[300px] h-14 bg-slate-200 rounded-lg mt-4" />
                            </div>

                            {/* Right Section - Properly Right-Aligned */}
                            <div className="w-full md:w-full lg:w-[80%] 2xl:w-[60%] bg-white bg-opacity-30 backdrop-blur-sm rounded-3xl py-4 md:p-4 2xl:p-12 flex flex-col justify-evenly items-center text-center">
                                <Skeleton className="h-6 w-[90%] md:w-[100%] mb-3 bg-slate-200" />
                                <div className="flex items-center w-[80%] my-2">
                                    <div className="flex-1 border-t border-gray-100"></div>
                                    <p className="mx-4 text-white">Or</p>
                                    <div className="flex-1 border-t border-gray-100"></div>
                                </div>
                                <Skeleton className="w-full h-12 md:h-14 rounded-lg bg-slate-200" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="relative mt-0 lg:-mt-10 md:mt-4 flex justify-center">
                <div
                    className="lg:grid flex overflow-x-scroll lg:grid-cols-7 gap-2 sm:gap-2 md:gap-4 bg-white text-black py-4 px-4 rounded-2xl shadow-lg mx-auto w-full lg:w-[80%]"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    {[...Array(7)].map((_, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[calc(100%/3)] sm:w-auto flex flex-col items-center text-center space-y-2"
                        >
                            <div className="rounded-3xl flex items-center justify-center">
                                <Skeleton className="h-16 w-16 rounded-lg bg-slate-200" />
                            </div>
                            <div className="flex flex-col h-full justify-around">
                                <Skeleton className="h-4 w-[80%] bg-slate-200" />
                                <Skeleton className="h-4 w-[60%] bg-slate-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
