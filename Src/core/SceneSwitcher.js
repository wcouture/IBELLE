export async function SwitchScene(scene, sceneKey) {
    await FadeOut(scene);
    scene.scene.start(sceneKey);
}

async function FadeOut(scene, duration = 1000) {
    await Fade(scene, 0, scene.sys.game.config.width, duration);
}

export async function FadeIn(scene, duration = 1000) {
    console.log('Fading in scene...');
    await Fade(scene, scene.sys.game.config.width, 0, duration);
}

async function Fade(scene, startWidth, endWidth, duration = 1000) {
    const delta = endWidth - startWidth
    console.log(`Starting fade from width ${startWidth} to ${endWidth} over ${duration}ms`);
    console.log(`Delta for fade: ${delta}`);
    
    const rect = scene.add.rectangle(0, 0, startWidth, scene.sys.game.config.height, 0x000000)
    rect.setOrigin(0);
    rect.setDepth(9999); // Ensure the rectangle is on top of all other elements
    rect.setScrollFactor(0);
    
    let fadeComplete;
    if (delta < 0) {
        fadeComplete = () => rect.width <= endWidth; 
    } else {
        fadeComplete = () => rect.width >= endWidth;
    }

    while (!fadeComplete()) {
        rect.width += (delta) / (duration / 20);
        await new Promise(resolve => setTimeout(resolve, 20));
    }
}