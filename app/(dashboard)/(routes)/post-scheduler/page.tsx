'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ChevronDown, ChevronUp, GripVertical, ImageIcon, Video, FileText, Edit } from 'lucide-react'

type PostType = 'image' | 'video' | 'carousel'
type Post = {
  id: string
  type: PostType
  date: Date
  content: string
}

export default function Component() {
  const [postsPerWeek, setPostsPerWeek] = useState(3)
  const [postTypes, setPostTypes] = useState<PostType[]>(['image', 'video', 'carousel'])
  const [posts, setPosts] = useState<Post[]>([])
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {

    const generateSchedule = () => {
      const newPosts: Post[] = []
      const today = new Date()
      for (let i = 0; i < postsPerWeek * 4; i++) {
        const date = new Date(today.getTime() + i * (24 * 60 * 60 * 1000))
        if (date.getDay() !== 0 && date.getDay() !== 6) { // Exclude weekends
          newPosts.push({
            id: `post-${i}`,
            type: postTypes[Math.floor(Math.random() * postTypes.length)],
            date: date,
            content: `Sample content for post ${i + 1}`
          })
        }
      }
      setPosts(newPosts)
    }

    generateSchedule()
  }, [postsPerWeek, postTypes])



  const onDragEnd = (result: any) => {
    if (!result.destination) return
    const items = Array.from(posts)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setPosts(items)
  }

  const updatePost = (id: string, updates: Partial<Post>) => {
    setPosts(posts.map(post => post.id === id ? { ...post, ...updates } : post))
    setEditingPost(null)
  }

  const PostTypeIcon = ({ type }: { type: PostType }) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5" />
      case 'video':
        return <Video className="w-5 h-5" />
      case 'carousel':
        return <FileText className="w-5 h-5" />
    }
  }

  const PostPreview = ({ type }: { type: PostType }) => {
    switch (type) {
      case 'image':
        return (
          <div className="relative w-full pt-[125%]">
            <Image
              src="/placeholder.svg?height=500&width=400"
              alt="Image post preview"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        )
      case 'video':
        return (
          <div className="relative w-full pt-[125%] bg-gray-200 flex items-center justify-center rounded-md">
            <Video className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-gray-400" />
          </div>
        )
      case 'carousel':
        return (
          <div className="relative w-full pt-[125%] bg-gray-200 flex items-center justify-center rounded-md">
            <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-gray-400" />
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Instagram Post Scheduler</h1>
      
      <div className="grid gap-4 mb-8">
        <div>
          <Label htmlFor="postsPerWeek">Posts per week</Label>
          <Select onValueChange={(value) => setPostsPerWeek(Number(value))}>
            <SelectTrigger id="postsPerWeek">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map(num => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Post types</Label>
          <div className="flex gap-2">
            {(['image', 'video', 'carousel'] as PostType[]).map(type => (
              <Button
                key={type}
                variant={postTypes.includes(type) ? 'default' : 'outline'}
                onClick={() => setPostTypes(prev => 
                  prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                )}
              >
                <PostTypeIcon type={type} />
                <span className="ml-2 capitalize">{type}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="posts">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {posts.map((post, index) => (
                <Draggable key={post.id} draggableId={post.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-card"
                    >
                      <CardHeader className="flex flex-row items-center">
                        <div {...provided.dragHandleProps} className="mr-2">
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <CardTitle className="flex-grow">
                          {post.date.toLocaleDateString()} - <PostTypeIcon type={post.type} />
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingPost(editingPost === post.id ? null : post.id)}
                        >
                          {editingPost === post.id ? <ChevronUp /> : <ChevronDown />}
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <PostPreview type={post.type} />
                          <p className="text-sm text-muted-foreground">{post.content}</p>
                        </div>
                        {editingPost === post.id && (
                          <div className="space-y-4 mt-4">
                            <div>
                              <Label htmlFor={`date-${post.id}`}>Date</Label>
                              <Calendar
                                mode="single"
                                selected={post.date}
                                onSelect={(date) => date && updatePost(post.id, { date })}
                                className="rounded-md border"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`type-${post.id}`}>Type</Label>
                              <Select
                                onValueChange={(value) => updatePost(post.id, { type: value as PostType })}
                                defaultValue={post.type}
                              >
                                <SelectTrigger id={`type-${post.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {(['image', 'video', 'carousel'] as PostType[]).map(type => (
                                    <SelectItem key={type} value={type}>
                                      <div className="flex items-center">
                                        <PostTypeIcon type={type} />
                                        <span className="ml-2 capitalize">{type}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor={`content-${post.id}`}>Content</Label>
                              <Textarea
                                id={`content-${post.id}`}
                                value={post.content}
                                onChange={(e) => updatePost(post.id, { content: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <Button
                              onClick={() => router.push(`/post-editor/${post.id}`)}
                              className="w-full"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Post
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}