let canvas;
let engine;
let scene;
let light;
let shadowGenerator;
  
window.onload = function () {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);

    setScene();
    setLight();
    setShadowGenerator();
    setCamera();
    setGround();
    setFog(scene);
    setSkybox(scene);
    addObjects();
    initializeXR();

    engine.runRenderLoop(function () {
        if (scene && scene.activeCamera) {
            scene.render();
        }
    });
}

async function initializeXR() {
    let xr = await scene.createDefaultXRExperienceAsync({});
    if (!xr.baseExperience) { }
    else {
        xr.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
            xrInput: xr.input
        });
    }
}

function setScene() {
    scene = new BABYLON.Scene(engine);
}

function setLight() {
    light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(90, -180, 90), scene);
    //let light2 = BABYLON.HemisphericalLight("light", new BABYLON.Vector3(1, 1, -0.5),scene);
}

function setShadowGenerator() {
    shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
}

function setCamera() {
    let camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 3, new BABYLON.Vector3(0, 1, 0));
    camera.attachControl(canvas, true);
}

function setFog(scene) {
    scene.fogColor = new BABYLON.Color3(1, 2, 3);
    scene.fogDensity = 0.0000;
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    //BABYLON.Scene.FOGMODE_NONE;
    //BABYLON.Scene.FOGMODE_EXP;
    //BABYLON.Scene.FOGMODE_EXP2;
    //BABYLON.Scene.FOGMODE_LINEAR;

    //Only if LINEAR
    //scene.fogStart = 20.0;
    //scene.fogEnd = 5000.0;
}

function setGround() {
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 5000, height: 5000 });
    const material = new BABYLON.StandardMaterial("GroundMaterial", scene);
    ground.receiveShadows = true;
    ground.material = material;
    material.bumpTexture = new BABYLON.Texture("https://stellarx-webxr-resources.s3.ca-central-1.amazonaws.com/textures/ground/ground_normal.jpg", scene);
    material.bumpTexture.uScale = 500;
    material.bumpTexture.vScale = 500;
    material.diffuseTexture = new BABYLON.Texture("https://stellarx-webxr-resources.s3.ca-central-1.amazonaws.com/textures/ground/ground_a_1.jpg", scene);
    material.diffuseTexture.uScale = 500;
    material.diffuseTexture.vScale = 500;
    material.diffuseColor = new BABYLON.Color3(1.13, 1.1, 1.1);
}

function setSkybox() {
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 2000.0 }, scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://stellarx-webxr-resources.s3.ca-central-1.amazonaws.com/textures/skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    skybox.renderingGroupId = 0;
}

function addObjectsToScene(instanceCount) {

    for (let i = 0; i < instanceCount; i++) {

    }
}

function addObjects() {
    let box = BABYLON.MeshBuilder.CreateBox("box", { width: 0.3, height: 0.3, depth: 0.3 });
    setObjectPosition(box, 0, 1, 0);
    setObjectMaterial(box, new BABYLON.StandardMaterial("material"));
    setObjectMaterialColor(box, BABYLON.Color3.Random());
    addDragBehaviour(box);

    let octa = BABYLON.MeshBuilder.CreatePolyhedron("octa", { type: 1, size: 0.15 });
    setObjectPosition(octa, 0.5, 1, 0);
    setGizmo(octa);

    shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.getShadowMap().renderList.push(box);
    shadowGenerator.addShadowCaster(box);
}

function setObjectPosition(object, xPosition, yPosition, zPosition) {
    object.position.x = xPosition;
    object.position.y = yPosition;
    object.position.z = zPosition;
}

function setObjectRotation(object, xRotation, yRotation, zRotation) {
    object.rotation.x = xRotation;
    object.rotation.y = yRotation;
    object.rotation.z = zRotation;
}

function setObjectScale(object, xScale, yScale, zScale) {
    object.scale.x = xScale;
    object.scale.y = yScale;
    object.scale.z = zScale;
}

function setObjectMaterial(object, material) {
    object.material = material;
}

function setObjectMaterialColor(object, color) {
    object.material.diffuseColor = color;
}

function addDragBehaviour(object) {
    let sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
    sixDofDragBehavior.allowMultiPointer = true;
    sixDofDragBehavior.rotateWithMotionController = false;
    object.addBehavior(sixDofDragBehavior);
}

function setGizmo(object) {
    var gizmoManager = new BABYLON.GizmoManager(scene);
    gizmoManager.boundingBoxGizmoEnabled = true;
    gizmoManager.boundingBoxDragBehavior.allowMultiPointer = false;
    gizmoManager.gizmos.boundingBoxGizmo.setEnabledScaling(true, true);
    gizmoManager.gizmos.boundingBoxGizmo.scaleBoxSize = 0.04;
    gizmoManager.gizmos.boundingBoxGizmo.rotationSphereSize = 0.05;
    gizmoManager.attachableMeshes = [object];
}