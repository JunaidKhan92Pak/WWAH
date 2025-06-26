import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
const UpcomingWebinars = () => {
  return (
    <>
     <Card>
                 <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                   <h5 className="pt-2 self-start">Upcoming Webinars</h5>
     
                   <Image
                     src="/partnersportal/webinars.svg" // Make sure this is in your public/icons folder
                     alt="No webinars alert"
                     width={100}
                     height={100}
                   />
     
                   <div>
                     <p className="font-bold">Stay tuned!</p>
                     <p>No upcoming webinars available right now.</p>
                   </div>
                 </CardContent>
               </Card> 
    </>
  )
}

export default UpcomingWebinars
