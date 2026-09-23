const TILE_SPRITE_ASSETS = import.meta.glob('../world/tile_sprites/*.png', {
  eager: true,
  import: 'default',
});

function getSpriteAssetUrl(fileStem) {
  return TILE_SPRITE_ASSETS[`../world/tile_sprites/${fileStem}.png`] ?? null;
}

export class SpriteAnimationHandler {
  constructor(scene) {
    this.scene = scene;
    this.seriesFrames = new Map();
    this.animationMeta = new Map();
  }

  preloadFrameSeries(seriesConfigs) {
    for (const config of seriesConfigs) {
      const {
        seriesKey,
        framePrefix,
        startFrame,
        endFrame,
        zeroPad = 0,
      } = config;

      const frameTextureKeys = [];

      for (let frameNumber = startFrame; frameNumber <= endFrame; frameNumber += 1) {
        const frameSuffix = String(frameNumber).padStart(zeroPad, '0');
        const fileStem = `${framePrefix}${frameSuffix}`;
        const textureKey = `anim:${fileStem}`;
        const assetUrl = getSpriteAssetUrl(fileStem);

        if (!assetUrl) continue;

        if (!this.scene.textures.exists(textureKey)) {
          this.scene.load.image(textureKey, assetUrl);
        }

        frameTextureKeys.push(textureKey);
      }

      this.seriesFrames.set(seriesKey, frameTextureKeys);
    }
  }

  createAnimations(animationConfigs) {
    for (const config of animationConfigs) {
      const {
        animationKey,
        seriesKey,
        frameRate,
        repeat = -1,
      } = config;

      const frameTextureKeys = this.seriesFrames.get(seriesKey) ?? [];
      if (frameTextureKeys.length === 0) continue;

      if (this.scene.anims.exists(animationKey)) {
        this.scene.anims.remove(animationKey);
      }

      this.scene.anims.create({
        key: animationKey,
        frames: frameTextureKeys.map((key) => ({ key })),
        frameRate,
        repeat,
      });

      this.animationMeta.set(animationKey, {
        frameTextureKeys,
        repeat,
      });
    }
  }

  setAnimationRate(animationKey, frameRate) {
    const animation = this.scene.anims.get(animationKey);
    const animationConfig = this.animationMeta.get(animationKey);

    if (!animation || !animationConfig) return;

    this.scene.anims.remove(animationKey);
    this.scene.anims.create({
      key: animationKey,
      frames: animationConfig.frameTextureKeys.map((key) => ({ key })),
      frameRate,
      repeat: animationConfig.repeat,
    });
  }

  play(sprite, animationKey, playbackRate = 1) {
    if (!sprite?.anims || !this.scene.anims.exists(animationKey)) return;

    if (!sprite.anims.currentAnim || sprite.anims.currentAnim.key !== animationKey) {
      sprite.play(animationKey, true);
    }

    sprite.anims.timeScale = playbackRate;
  }
}
