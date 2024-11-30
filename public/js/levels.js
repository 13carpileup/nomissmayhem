import { indexTest, roomsTest } from "./gameDesign/testLevel.js";
import { indexTutorial, roomsTutorial } from "./gameDesign/tutorial.js";
import { indexLevel1, roomsLevel1 } from "./gameDesign/levelone.js";


export const allRooms = [
    [roomsTutorial, indexTutorial, "Tutorial"],
    [roomsLevel1, indexLevel1, "Level 1"],
    [roomsTutorial, indexTutorial, "Level 2"],
    [roomsTest, indexTest, "Legacy Tutorial"]
]