import { indexTest, roomsTest } from "./gameDesign/testLevel.js";
import { indexTutorial, roomsTutorial } from "./gameDesign/tutorial.js";

export const allRooms = [
    [roomsTutorial, indexTutorial, "Tutorial"],
    [roomsTutorial, indexTutorial, "Level 1"],
    [roomsTutorial, indexTutorial, "Level 2"],
    [roomsTest, indexTest, "Legacy Tutorial"]
]