# Simple-3d-Renderer
 Simple 3d renderer made from scratch in js with basic raycasting and can .obj file loader
 
# Demo
![Alt Text](https://github.com/NRicode/Simple-3d-Renderer/blob/main/demo.gif "Demo")

# My findings
In 3d rendering done by hardware, the z order is calculated by storing every single pixel's z coordinate of a polygon and then measuring them to see which one should be visible, because this is taken care of by gpu, it is very fast. However, when 3d rendering is done by software, it will be very slow to store every single pixel's z coordinate without sacrificing resolution. I have yet to find any algorithm that can calculate precisely the correct z order of polygons in 3d space, The best I can come up with is by sorting the polygons by the distance of the camera to the center coordinate of the polygon in 3d space. It works pretty well but there are still some little glitches visible if you look closely.
