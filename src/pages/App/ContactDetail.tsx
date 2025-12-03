import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Workflow, StickyNote, Paperclip } from "lucide-react";
const mockTimeline = [
  { type: 'email', content: 'Sent "Welcome" email', date: '2 days ago' },
  { type: 'note', content: 'Called to follow up, interested in Pro plan.', date: '1 day ago' },
  { type: 'automation', content: 'Entered "Nurture Sequence" workflow', date: '1 day ago' },
  { type: 'sms', content: 'Replied: "Thanks for the info!"', date: '3 hours ago' },
];
export function ContactDetail() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://github.com/shadcn.png" alt="Alice Johnson" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">Alice Johnson</h1>
            <p className="text-muted-foreground">alice@example.com</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline">Add Note</Button>
            <Button>Start Automation</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="activity">
              <TabsList>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="deals">Deals</TabsTrigger>
                <TabsTrigger value="automations">Automations</TabsTrigger>
                <TabsTrigger value="notes">Notes & Files</TabsTrigger>
              </TabsList>
              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {mockTimeline.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            {item.type === 'email' && <MessageSquare className="h-4 w-4 text-muted-foreground" />}
                            {item.type === 'note' && <StickyNote className="h-4 w-4 text-muted-foreground" />}
                            {item.type === 'automation' && <Workflow className="h-4 w-4 text-muted-foreground" />}
                            {item.type === 'sms' && <MessageSquare className="h-4 w-4 text-muted-foreground" />}
                          </div>
                          <div>
                            <p>{item.content}</p>
                            <p className="text-sm text-muted-foreground">{item.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm">Full Name</h4>
                  <p className="text-muted-foreground">Alice Johnson</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Email</h4>
                  <p className="text-muted-foreground">alice@example.com</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Phone</h4>
                  <p className="text-muted-foreground">(555) 123-4567</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Tags</h4>
                  <div className="flex gap-1 mt-1">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">lead</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">newsletter</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}