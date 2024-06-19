'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { BoxSelect, Paintbrush } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

// export function PickerExample() {
//   const [background, setBackground] = useState('#B4D455')
//   const [font, setFont] = useState('#B4D455')

//   return (
//     <div
//       className="w-full h-full preview flex min-h-[350px] justify-center p-10 items-center rounded !bg-cover !bg-center transition-all"
//       style={{ background }}
//     >
//       <GradientPicker font={font} setFont={setFont} background={background} setBackground={setBackground} />
//     </div>
//   )
// }

export function GradientPicker({
  background,
  font,
  setBackground,
  setFont,
  className,
}: {
  background: string
  font: string
  setBackground: (background: string) => void
  setFont: (font: string) => void
  className?: string
}) {
  
  const solids = [
  '#000000', // Black
  '#ffffff', // White
  '#219ebc', // Blue
  '#8ecae6', // Navy
  '#219ebc', // Blue
  '#023047', // Green
  '#ffb703', // Teal
  '#fb8500', // Aqua
  '#e63946', // Maroon
  '#f1faee', // Purple
  '#a8dadc', // Olive
  '#457b9d', // Gray
  '#1d3557', // Brown
  '#cdb4db', // Light Blue
  '#ffc8dd', // Light Steel Blue
  '#ffafcc', // Silver
  '#bde0fe', // Chocolate
  '#a2d2ff', // Goldenrod
  '#ccd5ae', // Crimson
  '#e9edc9', // Gainsboro
  '#fefae0', // Lavender
  '#faedcd', // Pale Goldenrod
  '#d4a373', // Light Coral
  '#386641', // Khaki
  '#6a994e', // Alice Blue
  '#a7c957', // Sandy Brown
  '#f2e8cf', // Wheat
  '#bc4749', // Salmon
  '#780000', // Antique White
  '#c1121f', // Old Lace
  '#fdf0d5', // Moccasin
  '#ffba08', // Bisque
  '#faa307', // Misty Rose
  '#f48c06', // Blanched Almond
  '#ffcdb2', // Papaya Whip
  '#e5989b', // Lavender Blush
  '#6d6875', // Seashell
  '#b5838d', // Cornsilk
  '#e3d5ca', // Lemon Chiffon
  '#f5ebe0', // Floral White
];

const solidsBackground = [
  '#000000', // Black
  '#ffffff', // White
  '#219ebc', // Blue
  '#023047', // Green
  '#ffb703', // Teal
  '#fb8500', // Aqua
  '#e63946', // Maroon
  '#f1faee', // Purple
  '#a8dadc', // Olive
  '#457b9d', // Gray
  '#1d3557', // Brown
  '#cdb4db', // Light Blue
  '#ffc8dd', // Light Steel Blue
  '#ffafcc', // Silver
  '#bde0fe', // Chocolate
  '#a2d2ff', // Goldenrod
  '#ccd5ae', // Crimson
  '#e9edc9', // Gainsboro
  '#fefae0', // Lavender
  '#faedcd', // Pale Goldenrod
  '#d4a373', // Light Coral
  '#386641', // Khaki
  '#6a994e', // Alice Blue
  '#a7c957', // Sandy Brown
  '#f2e8cf', // Wheat
  '#bc4749', // Salmon
  '#780000', // Antique White
  '#c1121f', // Old Lace
  '#fdf0d5', // Moccasin
  '#ffba08', // Bisque
  '#faa307', // Misty Rose
  '#f48c06', // Blanched Almond
  '#ffcdb2', // Papaya Whip
  '#e5989b', // Lavender Blush
  '#6d6875', // Seashell
  '#b5838d', // Cornsilk
  '#e3d5ca', // Lemon Chiffon
  '#f5ebe0', // Floral White
  '#f8f7ff', // Snow
];


  const gradients = [
    'linear-gradient(to top left,#accbee,#e7f0fd)',
    'linear-gradient(to top left,#d5d4d0,#d5d4d0,#eeeeec)',
    'linear-gradient(to top left,#000000,#434343)',
    'linear-gradient(to top left,#09203f,#537895)',
    'linear-gradient(to top left,#AC32E4,#7918F2,#4801FF)',
    'linear-gradient(to top left,#f953c6,#b91d73)',
    'linear-gradient(to top left,#ee0979,#ff6a00)',
    'linear-gradient(to top left,#F00000,#DC281E)',
    'linear-gradient(to top left,#00c6ff,#0072ff)',
    'linear-gradient(to top left,#4facfe,#00f2fe)',
    'linear-gradient(to top left,#0ba360,#3cba92)',
    'linear-gradient(to top left,#FDFC47,#24FE41)',
    'linear-gradient(to top left,#8a2be2,#0000cd,#228b22,#ccff00)',
    'linear-gradient(to top left,#40E0D0,#FF8C00,#FF0080)',
    'linear-gradient(to top left,#fcc5e4,#fda34b,#ff7882,#c8699e,#7046aa,#0c1db8,#020f75)',
    'linear-gradient(to top left,#ff75c3,#ffa647,#ffe83f,#9fff5b,#70e2ff,#cd93ff)',
  ]

  const images = [
    'url(https://images.unsplash.com/photo-1691200099282-16fd34790ade?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)',
    'url(https://images.unsplash.com/photo-1691226099773-b13a89a1d167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90',
    'url(https://images.unsplash.com/photo-1688822863426-8c5f9b257090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)',
    'url(https://images.unsplash.com/photo-1691225850735-6e4e51834cad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)',
  ]

  const defaultTab = useMemo(() => {
    if (background.includes('url')) return 'image'
    if (background.includes('gradient')) return 'gradient'
    return 'solid'
  }, [background])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            ' w-32 justify-start text-left font-normal ',
            !font && 'text-muted-foreground',
            className
          )}
        >
          <div className="flex items-center gap-2">
            {/* {background ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background }}
              ></div>
            ) : (
              <div></div>
            )} */}
            
            <Paintbrush className="h-4 w-4" />
            <span>Font Color</span>
            {/* <div className="truncate flex-1">
              {background ? '' : 'Pick a color'}
            </div> */}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger className="flex-1" value="solid">
              Font
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="gradient">
              Background
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solid" className="flex flex-wrap gap-1 mt-0">
            {solids.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="rounded-md h-6 w-6 cursor-pointer active:scale-105 border"
                onClick={() => setFont(s)}
              />
            ))}
             <Input
                id="custom"
                value={font}
                className="col-span-2 h-8 mt-4"
                onChange={(e) => setFont(e.currentTarget.value)}
                />
          </TabsContent>

          <TabsContent value="gradient" className="flex flex-wrap gap-1 mt-0">
            {/* <div className="flex flex-wrap gap-1 mb-2">
              {gradients.map((s) => (
                <div
                  key={s}
                  style={{ background: s }}
                  className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                  onClick={() => setBackground(s)}
                />
              ))}
            </div> */}
            <div
                  className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                  onClick={() => setBackground('Transparent')}
                >
                <BoxSelect />
                </div>
            {solidsBackground.map((s) => (
                <div
                  key={s}
                  style={{ background: s }}
                  className="rounded-md h-6 w-6 cursor-pointer active:scale-105 border"
                  onClick={() => setBackground(s)}
                />
              ))}
              <Input
                  id="custom"
                  value={background}
                  className="col-span-2 h-8 mt-4"
                  onChange={(e) => setBackground(e.currentTarget.value)}
                  />

          </TabsContent>


          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>

      </PopoverContent>
    </Popover>
  )
}

const GradientButton = ({
  background,
  children,
}: {
  background: string
  children: React.ReactNode
}) => {
  return (
    <div
      className="p-0.5 rounded-md relative !bg-cover !bg-center transition-all"
      style={{ background }}
    >
      <div className="bg-popover/80 rounded-md p-1 text-xs text-center">
        {children}
      </div>
    </div>
  )
}