export class GameSceneHUD {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.sciencePointsLabel = this.uiManager.addLabel(32, 62, `Science Points: 0 | Knowledge: 0%`, false);
        this.worldLabel = this.uiManager.addLabel(32, 32, `World: Unknown`, false);
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