export class GameSceneHUD {
    constructor(uiManager, pageWidth = 1280, pageHeight = 720) {
        this.uiManager = uiManager;
        this.pageWidth = pageWidth;
        this.pageHeight = pageHeight;

        const paddingX = Math.max(24, pageWidth * 0.02);
        const paddingY = Math.max(24, pageHeight * 0.04);
        this.sciencePointsLabel = this.uiManager.addLabel(paddingX, paddingY + 28, `Science Points: 0 | Knowledge: 0%`, false);
        this.worldLabel = this.uiManager.addLabel(paddingX, paddingY, `World: Unknown`, false);
    }

    setSciencePoints(sciencePoints) {
        const currentText = this.sciencePointsLabel.text;
        const knowledgeMatch = currentText.match(/Knowledge: (\d+)%/);
        const knowledge = knowledgeMatch ? knowledgeMatch[1] : 0;
        this.sciencePointsLabel.setText(`Science Points: ${sciencePoints} | Knowledge: ${knowledge}%`);
    }

    setKnowledge(knowledge) {
        const currentText = this.sciencePointsLabel.text;
        const sciencePointsMatch = currentText.match(/Science Points: (\d+)/);
        const sciencePoints = sciencePointsMatch ? sciencePointsMatch[1] : 0;
        this.sciencePointsLabel.setText(`Science Points: ${sciencePoints} | Knowledge: ${knowledge}%`);
    }

    setWorld(world) {
        this.worldLabel.setText(`World: ${world}`);
    }
}