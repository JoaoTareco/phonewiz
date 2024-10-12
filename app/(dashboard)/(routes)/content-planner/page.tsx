'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import { Calendar, Image, Video, Mic, Plus, X, Edit, AlertCircle, Cog, RefreshCw } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { InstagramPostCard } from "@/components/post-card"
import { Heading } from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import { Loader } from "@/components/loader"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useMediaQuery } from 'react-responsive'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Spinner } from '@/components/remotion/Spinner/Spinner'

type PostType = 'video' | 'carousel'
type PostTag = 'awareness' | 'nurturing' | 'converting'

type Post = {
  id: string
  date: Date
  type: PostType
  tag: PostTag
  topic: string
  hook: string
  cta: string
  thumbnailUrl: string
}



const MAX_POSTS_PER_DAY = 2

export default function Component() {
  const [postsPerWeek, setPostsPerWeek] = useState(7)
  const [posts, setPosts] = useState<Post[]>([])
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPostId, setLoadingPostId] = useState<string | null>(null); // Track which post is loading
  const [audience, setAudience] = useState(null);
  const [isLoadingAudience, setIsLoadingAudience] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const FormSchema = z.object({
    niche: z.string({
      required_error: "Please describe your niche and ideal audience.",
    }),
    struggles: z.string({
      required_error: "Please write some struggles they usually face.",
    }),
    mistakes: z.string({
      required_error: "Please write some mistakes they make.",
    }),
    social_proof: z.string({
      required_error: "Please write some social proof that should be shown.",
    })
  })
  
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: audience || {}, // Set default values to audience if it exists
  });

  // Use useEffect to update form values when audience changes
  useEffect(() => {
    if (audience) {
      form.reset(audience);
    }
  }, [audience, form]);

  useEffect(() => {
    const fetchAudienceAndContentPlan = async () => {
      setIsLoadingAudience(true);
      try {
        // Fetch audience
        const audienceResponse = await fetch('/api/get-audience');
        const audienceData = await audienceResponse.json();
        setAudience(audienceData);

        // If audience exists, fetch content plan
        if (audienceData) {
          const contentPlanResponse = await fetch('/api/get-content-plan');
          const contentPlanData = await contentPlanResponse.json();
          console.log(contentPlanData)
          // Map the results directly to the posts state
          const detailedPosts = contentPlanData?.content_plan.map((result: any, index: number) => ({
            id: `post-${index}`,
            date: addDays(startOfWeek(new Date()), Math.floor(index * (7 / postsPerWeek))),
            type: 'video', // or 'carousel' based on your logic
            tag: result.objective, // Use the objective as the tag
            topic: result.topic,
            hook: result.hook,
            thumbnailUrl: '', // Replace with actual thumbnail URL
            cta: result.cta,
          }));
          setPosts(detailedPosts);
        }
      } catch (error) {
        console.error("Failed to fetch audience or content plan:", error);
        toast({
          title: "Error",
          description: "Something went wrong while fetching your content plan.",
          variant: "destructive",
        });
      }
      setIsLoadingAudience(false);
    };

    fetchAudienceAndContentPlan();
  }, [postsPerWeek, toast]);

  const defineAudience = async (values: z.infer<typeof FormSchema>) => {
    let attempts = 0;
    while (attempts < 3) {
      try {
        setIsDialogOpen(false);
        setIsLoadingAudience(true);
        setAudience(values);
        await fetch('/api/define-audience', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        setIsLoadingAudience(false);
        return; // Exit the loop if successful
      } catch (error) {
        attempts++;
        if (attempts === 3) {
          console.error("Failed to define audience after 3 attempts:", error);
          toast({
            title: "Something went wrong",
            description: "Please try again.",
            variant: "destructive",
          });
          setIsLoadingAudience(false);
          return; // Exit the loop after 3 attempts
        }
      }
    }

    await generatePosts();
  };

  const generatePosts = async () => {
    setIsLoadingPosts(true);
    const startDate = startOfWeek(new Date());

    // Fetch the full list of posts via get-posts-plan
    const response = await fetch('/api/get-posts-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        niche: audience.niche,
        struggles: audience.struggles,
        mistakes: audience.mistakes,
        social_proof: audience.social_proof,
        specific_content: 'None', // Replace with actual specific content
        num_posts: postsPerWeek, // Send the number of posts to generate
        existing_topics: posts.map(post => post.topic) // Pass existing topics to avoid duplicates
      }),
    });

    const results = await response.json();

    // Map the results directly to the posts state
    const detailedPosts = results.map((result: any, index: number) => ({
      id: `post-${index}`,
      date: addDays(startDate, Math.floor(index * (7 / postsPerWeek))),
      type: 'video', // or 'carousel' based on your logic
      tag: result.objective, // Use the objective as the tag
      topic: result.topic,
      hook: result.hook,
      thumbnailUrl: '', // Replace with actual thumbnail URL
      cta: result.cta,
    }));

    // Set the posts state with the detailed posts
    setPosts(detailedPosts);
    setIsLoadingPosts(false);
  };

  const addPostToDay = async (date: Date) => {
    const postsForDay = posts.filter(post => isSameDay(post.date, date));
    if (postsForDay.length >= MAX_POSTS_PER_DAY) {
      toast({
        title: "Cannot add post",
        description: `Maximum of ${MAX_POSTS_PER_DAY} posts allowed per day.`,
        variant: "destructive",
      });
      return;
    }

    // Make a request to the create-post endpoint to fetch a new post
    const response = await fetch('/api/create-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        niche: audience.niche,
        struggles: audience.struggles,
        mistakes: audience.mistakes,
        social_proof: audience.social_proof,
        specific_content: 'None', // Replace with actual specific content
        num_posts: 1 // Request a single post
      }),
    });

    const result = await response.json();

    // Create a new post from the response  
    const newPost: Post = {
      id: `post-${posts.length}`,
      date,
      type: 'video', // or 'carousel' based on your logic
      tag: result[0].objective, // Use the objective as the tag
      topic: result[0].topic,
      hook: result[0].hook,
      thumbnailUrl: result[0].videoSequences[0].video, // Replace with actual thumbnail URL
      cta: result[0].cta,
    };

    setPosts([...posts, newPost]);
  };

  const regeneratePost = async (postId: string, topic: string) => {
    setLoadingPostId(postId);
    setIsLoading(true);

    try {
      const body = {
        niche: audience.niche,
        struggles: audience.struggles,
        mistakes: audience.mistakes,
        social_proof: audience.social_proof,
        specific_content: 'None',
        regenerate_topic: topic,
        num_posts: 1
      };

      const existingTopics = posts.map(post => post.topic);
      if (existingTopics.length > 0) {
        body.existing_topics = existingTopics;
      }

      const response = await fetch('/api/get-posts-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log(response)

      if (response.status !== 200) {
        toast({
          title: "Error",
          description: "Failed to regenerate the post. Please try again.",
          variant: "destructive",
        });
        throw new Error('API request failed');
      }

      const result = await response.json();

      const currentPost = posts.find(post => post.id === postId);
      const postDate = currentPost ? currentPost.date : new Date();

      const newPost: Post = {
        id: postId,
        date: postDate,
        type: 'video',
        tag: result[0].objective,
        topic: result[0].topic,
        hook: result[0].hook,
        thumbnailUrl: '',
        cta: result[0].cta,
      };

      setPosts(posts.map(post => post.id === postId ? newPost : post));
      
      toast({
        title: "Post Regenerated",
        description: "Your post has been successfully updated.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to regenerate post:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate the post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingPostId(null);
    }
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(new Date()), i))

  const handlePostsPerWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value, 10);
    
    if (value === "") {
      setPostsPerWeek(1); // Set to minimum when input is empty
    } else if (!isNaN(numValue)) {
      if (numValue < 1) {
        setPostsPerWeek(1);
      } else if (numValue > 14) {
        setPostsPerWeek(14);
      } else {
        setPostsPerWeek(numValue);
      }
    }
  }

  const handlePostsPerWeekBlur = () => {
    if (postsPerWeek < 1) {
      setPostsPerWeek(1);
    } else if (postsPerWeek > 14) {
      setPostsPerWeek(14);
    }
  }

  return (
<div>
    <Heading
      title="Content Planner"
      description="Create a content plan."
      icon={Calendar}
      iconColor="text-gray-700"
      bgColor="bg-gray-700/10"
    />
   <div className="container mx-auto max-w-full px-4 lg:px-8">
      <Separator className="my-4" />
      {isLoadingAudience && (
        <div className="flex justify-center items-center h-screen pb-60 ">
          <Loader />
        </div>
      )}
    
      {!audience && !isLoadingAudience && ( <div className="flex justify-center">
        <div className={` w-5/6 aspect-[2/1] object-cover transition-all  justify-center text-center rounded-md ${isMobile ? 'mt-20' : 'mt-16'}`}>
          <h3 className={`text-lg font-semibold ${isMobile ? 'mt-36 ' : 'mt-40'}`}>Create a content plan</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Generate a new tailored content plan to always know what to post.
          </p>
          <Dialog >
              <DialogTrigger> <Button><Cog className="mr-2"/>Generate</Button></DialogTrigger>
              <DialogContent className={`overflow-auto scroll-smooth  ${isMobile ? '' : ''}`} >
             
                <DialogHeader>
                  <DialogTitle>Create a new audience</DialogTitle>
                  <DialogDescription>
                    Answer a few questions to set your audience and generate a new content plan.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(defineAudience)} className="space-y-6">
                    <FormField
                        name="niche"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-3 pt-2">
                            <FormLabel>How would you describe your niche/ideal audience?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. My niche is about making money with digital products and instagram. My ideal audience is content creators wanting to grow their Instagram." 
                                {...field}
                              />
                            </FormControl>
               
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <FormField
                        name="struggles"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-3">
                            <FormLabel>What are some common struggles or questions of your ideal audience?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. Not knowing how often to post, or what to post. Not focusing on hooks and giving value. Not knowing growth strategies." 
                                {...field}
                              />
                            </FormControl>
          
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <FormField
                        name="mistakes"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-3">
                            <FormLabel>What are some mistakes they usually make?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. Not improving their content. Focusing too much on quantity over quality. Disregarding the importance of IG stories." 
                                {...field}
                              />
                            </FormControl>
             
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <FormField
                        name="social_proof"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-2">
                            <FormLabel>What kind of social proof do they need to see?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. That I have grown my Instagram audience by 5k followers in the last month."  
                                {...field}
                              />
                            </FormControl>
                 
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <div className={`flex justify-end`}>
                    <Button type="submit" variant="secondary" className="justify-end">
                        {isLoading && <Spinner size={20}></Spinner>}
                        <span className="pl-2">Generate Plan</span>
                        </Button>
                    </div>
                  </form>
                </Form>
            
              </DialogContent>
            </Dialog>
            {isMobile && (<div className="text-center text-gray-500 mt-5 text-xs">This app was designed to be used on PC or Mac. For a better experience, use it on Desktop.</div>)}
        </div>
      </div>)}

      {audience && !isLoadingAudience && (
      <div>
       
          <div className="flex items-center justify-end mb-4">
             <Button onClick={generatePosts} disabled={isLoadingPosts}>Regenerate Posts{isLoadingPosts  ? <RefreshCw className="h-4 w-4 animate-spin ml-2" /> : <RefreshCw className="h-4 w-4 ml-2" />}</Button>
             
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger> <Button variant="secondary" className="ml-4">Change Audience{isLoadingAudience ? <Cog className="ml-2 h-5 w-5 animate-spin" /> : <Cog className="ml-2 h-5 w-5 "/>}</Button></DialogTrigger>
              <DialogContent className={`overflow-auto scroll-smooth h-5/6 ${isMobile ? '' : ''}`} >
             
                <DialogHeader>
                  <DialogTitle>Define your audience</DialogTitle>
                  <DialogDescription>
                    Try to be as specific and detailed as possible.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(defineAudience)} className="space-y-6">
                    <FormField
                        name="niche"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-3 pt-2">
                            <FormLabel>How would you describe your niche/ideal audience?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. My niche is about making money with digital products and instagram. My ideal audience is content creators wanting to grow their Instagram." 
                                {...field}
                              />
                            </FormControl>
               
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <FormField
                        name="struggles"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-3">
                            <FormLabel>What are some common struggles or questions of your ideal audience?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. Not knowing how often to post, or what to post. Not focusing on hooks and giving value. Not knowing growth strategies." 
                                {...field}
                              />
                            </FormControl>
          
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <FormField
                        name="mistakes"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-3">
                            <FormLabel>What are some mistakes they usually make?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. Not improving their content. Focusing too much on quantity over quality. Disregarding the importance of IG stories." 
                                {...field}
                              />
                            </FormControl>
             
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <FormField
                        name="social_proof"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-2">
                            <FormLabel>What kind of social proof do they need to see?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. That I have grown my Instagram audience by 5k followers in the last month."  
                                {...field}
                              />
                            </FormControl>
                 
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <div className={`flex justify-end`}>
                    <Button type="submit" variant="secondary" className="justify-end">
                    <span className="">Define Audience</span>
                        </Button>
                    </div>
                  </form>
                </Form>
            
              </DialogContent>
              
            </Dialog>
          </div>


      <ScrollArea className="w-full whitespace-nowrap rounded-md bg-white">
        <div className="flex">
          {weekDays.map((day, dayIndex) => (
             <div key={dayIndex} className="flex-none p-4 ">
            {/*  <div className="font-semibold text-center mb-2">{format(day, 'EEE')}</div> */}
             
              <div className="space-y-4 min-h-[100px]">
                {posts
                  .filter(post => isSameDay(post.date, day))
                  .map((post, index) => (
                    <InstagramPostCard
                      key={post.id}
                      id={post.id}
                      topic={post.topic}
                      hook={post.hook}
                      cta={post.cta}
                      thumbnailUrl={post.thumbnailUrl}
                      type={post.type}
                      tag={post.tag}
                      target_audience={audience?.niche}
                      onRegenerate={regeneratePost}
                      isLoading={isLoading && loadingPostId === post.id}
                    />
                  ))}
              </div>
              {/* <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => addPostToDay(day)}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Post
              </Button> */}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
    )}
    </div>
    </div>
  )
}