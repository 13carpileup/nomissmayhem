import { indexTest, roomsTest } from "./gameDesign/testLevel.js";
import { indexTutorial, roomsTutorial } from "./gameDesign/tutorial.js";
import { indexLevel1, roomsLevel1 } from "./gameDesign/levelone.js";
import { indexLevel2, roomsLevel2 } from "./gameDesign/leveltwo.js";



export const allRooms = [
    [roomsTutorial, indexTutorial, "Tutorial"],
    [roomsLevel1, indexLevel1, "Level 1"],
    [roomsLevel2, indexLevel2, "Level 2"],
    [roomsTest, indexTest, "Legacy Tutorial"]
]