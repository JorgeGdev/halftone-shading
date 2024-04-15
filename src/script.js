import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import halftoneVertexShader from './shaders/halftone/vertex.glsl'
import halftoneFragmentShader from './shaders/halftone/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    //UPDATE MATERIALS

    material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 7
camera.position.y = 7
camera.position.z = 7
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const rendererParameters = {}
rendererParameters.clearColor = '#26132f'

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor(rendererParameters.clearColor)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

gui
    .addColor(rendererParameters, 'clearColor')
    .onChange(() =>
    {
        renderer.setClearColor(rendererParameters.clearColor)
    })

/**
 * Material
 */
const materialParameters = {}
materialParameters.color = '#ff794d'
materialParameters.shadowColor = '#8e19b8'
materialParameters.lightColor = '#e5ffe0'


const material = new THREE.ShaderMaterial({
    vertexShader: halftoneVertexShader,
    fragmentShader: halftoneFragmentShader,
    uniforms:
    {
        uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
        uShadeColor: new THREE.Uniform(new THREE.Color(materialParameters.shadeColor)),
        uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio  )),
        uShadowsRepetitions: new THREE.Uniform(100),
        uShadowColor: new THREE.Uniform(new THREE.Color(materialParameters.shadowColor)),
        uLightRepetitions: new THREE.Uniform(130),
        uLightColor: new THREE.Uniform(new THREE.Color(materialParameters.lightColor))
    }
})

gui
    .addColor(materialParameters, 'color')
    .onChange(() =>
    {
        material.uniforms.uColor.value.set(materialParameters.color)
    })


gui.add(material.uniforms.uShadowsRepetitions, "value").min(10).max(300).step(1)
gui.addColor(materialParameters, "shadowColor")
.onChange(()=>
{
    material.uniforms.uShadowColor.value.set(materialParameters.shadowColor)
})

gui.add(material.uniforms.uLightRepetitions, "value").min(10).max(300).step(1).name("Light Repetitions")

gui.addColor(materialParameters, "lightColor")
.onChange(()=>
{
    material.uniforms.uLightColor.value.set(materialParameters.lightColor)
}).name("Light Color")


// BABY BEAR
let bear = null
gltfLoader.load(
    './baby_bear.glb',
    (gltf) =>
    {
        bear = gltf.scene
        bear.traverse((child) =>
        {
            if(child.isMesh)
                child.material = material
                scene.add(gltf.scene)
        })
        bear.scale.set(1, 1, 1)
        scene.add(bear)
    }
)


// BABY BEAR
let car3D = null
gltfLoader.load(
    './3d_car.glb',
    (gltf) =>
    {
        car3D = gltf.scene
        car3D.traverse((child) =>
        {
            if(child.isMesh)
                child.material = material
                scene.add(gltf.scene)
        })
        car3D.scale.set(0.5, 0.5, 0.5)
        car3D.position.x = -5
        car3D.position.y = -1.5
        car3D.rotation.y = Math.PI / 2
        scene.add(car3D)
    }
)


const orbitRadius = 3; // Radio de la órbita
const orbitSpeed = 0.5; // Velocidad de la órbita




/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Rotate BEAR
    if(bear)
    {
        //bear.rotation.x = - elapsedTime * 0.1
        bear.rotation.y = elapsedTime * 0.2
    }


    // Rotate BEAR


    // if(car3D)
    // {

    //     // Orbital motion for pointLightHelper2 around bear
    //     car3D.position.x = bear.position.x + orbitRadius *  Math.cos((elapsedTime * orbitSpeed)*2) / 0.5
    //     car3D.position.z = bear.position.z + orbitRadius *  Math.sin((elapsedTime * orbitSpeed*2)) / 0.5
    //     car3D.rotation.y = bear.position.z + orbitRadius * 0.25 * Math.tan( - Math.cos(elapsedTime * orbitSpeed * 2) ) /0.8
        
    // }


   
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()