"use client"

import React, { useRef } from "react"
import { motion, useAnimationFrame, useMotionValue } from "motion/react"

import { cn } from "@/lib/utils"

type FloatProps = {
  children: React.ReactNode
  speed?: number
  amplitude?: [number, number, number] // [x, y, z]
  rotationRange?: [number, number, number] // [x, y, z]
  timeOffset?: number
  className?: string
}

const Float: React.FC<FloatProps> = ({
  children,
  speed = 0.5,
  amplitude = [10, 30, 30], // Default [x, y, z] amplitudes
  rotationRange = [15, 15, 7.5], // Default [x, y, z] rotation ranges
  timeOffset = 0,
  className,
}) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const z = useMotionValue(0)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const rotateZ = useMotionValue(0)

  // Use refs for animation values to avoid recreating the animation frame callback
  const time = useRef(0)

  // Smoothing factor - lower = smoother, more lag
  const smoothing = 0.08

  useAnimationFrame(() => {
    time.current += speed * 0.015 // Slightly slower for smoother motion

    // Calculate target positions with smooth sinusoidal motion
    const targetX = Math.sin(time.current * 0.7 + timeOffset) * amplitude[0]
    const targetY = Math.sin(time.current * 0.6 + timeOffset) * amplitude[1]
    const targetZ = Math.sin(time.current * 0.5 + timeOffset) * amplitude[2]

    // Calculate target rotations with different frequencies for organic movement
    const targetRotateX = Math.sin(time.current * 0.5 + timeOffset) * rotationRange[0]
    const targetRotateY = Math.sin(time.current * 0.4 + timeOffset) * rotationRange[1]
    const targetRotateZ = Math.sin(time.current * 0.3 + timeOffset) * rotationRange[2]

    // Smooth interpolation - eases towards target
    x.set(x.get() + (targetX - x.get()) * smoothing)
    y.set(y.get() + (targetY - y.get()) * smoothing)
    z.set(z.get() + (targetZ - z.get()) * smoothing)
    rotateX.set(rotateX.get() + (targetRotateX - rotateX.get()) * smoothing)
    rotateY.set(rotateY.get() + (targetRotateY - rotateY.get()) * smoothing)
    rotateZ.set(rotateZ.get() + (targetRotateZ - rotateZ.get()) * smoothing)
  })

  return (
    <motion.div
      style={{
        x,
        y,
        z,
        rotateX,
        rotateY,
        rotateZ,
        transformStyle: "preserve-3d",
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  )
}

export default Float
