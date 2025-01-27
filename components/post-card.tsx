import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, RefreshCcw, RefreshCw, VideoIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import VideoThumbnail from 'react-video-thumbnail';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type PostType = 'video' | 'carousel'
type PostTag = 'Awareness' | 'Nurture' | 'Convertion'

interface InstagramPostCardProps {
  id: string
  topic: string
  hook: string
  cta: string
  thumbnailUrl: string
  type: PostType
  tag: PostTag
  target_audience: string
  onRegenerate: (id: string) => void
  isLoading: boolean
}

export function InstagramPostCard({
  id,
  topic,
  hook,
  thumbnailUrl,
  cta, 
  type,
  tag,
  target_audience,
  onRegenerate,
  isLoading
}: InstagramPostCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      personalInsights: '',
    },
  })

  const onSubmit = (data: { personalInsights: string }) => {
    const createPostUrl = `/post-generator?id=${id}&topic=${encodeURIComponent(topic)}&hook=${encodeURIComponent(hook)}&cta=${encodeURIComponent(cta)}&target_audience=${encodeURIComponent(target_audience)}&personal_insights=${encodeURIComponent(data.personalInsights)}`
    setIsDialogOpen(false)
    router.push(createPostUrl)
  }

  return (
    <Card 
      className="w-80 relative border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        variant="feedback"
        size="icon"
        className="absolute top-2 right-2 z-10"
        onClick={() => onRegenerate(id, topic)}
      >
        {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 " />}
      </Button>
      <CardHeader>
        <CardTitle className="text-sm font-bold overflow-hidden overflow-ellipsis whitespace-normal w-5/6">{topic}</CardTitle>
      </CardHeader>
      <CardContent >
        <div className="flex space-x-4">
          <div className="relative w-32 h-56 bg-muted flex-shrink-0">
            <Image 
              src={"https://images.pexels.com/photos/3692643/pexels-photo-3692643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
              alt="Post thumbnail"
              width={128}
              height={192}
              className="absolute inset-0 w-full h-full object-cover rounded-md"
              style={{filter: 'brightness(20%)'}}
            />
            <div className="absolute inset-0 flex items-center justify-center px-2">
              <p className="text-xs text-white overflow-hidden overflow-ellipsis whitespace-normal text-center ">{hook}</p>
            </div>
            <VideoIcon className="absolute bottom-2 right-2 h-6 w-6 text-white" />
          </div>
          <div className="grid space-y-4 content-top">
          
            <div>
              <h3 className="text-sm font-semibold mb-1">CTA:</h3>
              <p className="text-sm text-muted-foreground w-full overflow-hidden overflow-ellipsis whitespace-normal">{cta}</p>
            </div>
            <div>
            <h3 className="text-sm font-semibold mb-1">Objective:</h3>
                <Badge variant={tag === 'Awareness' ? 'default' : tag === 'Nurture' ? 'secondary' : 'destructive'}>
                  {tag}
                </Badge>
              </div>
            {/* <div>
              <h3 className="text-sm font-semibold mb-1">Type:</h3>
              <span className="text-sm font-medium">{type}</span>
            </div> */}
        
          
          </div>
        </div>
        <div className="content-end mt-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="secondary">
                Create<Edit className="w-4 h-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Personal Insights</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    name="personalInsights"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Insights on <strong>{topic}</strong></FormLabel>
                        <FormDescription className="pb-2">This is important to make the post more engaging and give something unique to your audience.</FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Share your personal experiences or insights on this topic..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Create Post
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
   
    </Card>
  )
}