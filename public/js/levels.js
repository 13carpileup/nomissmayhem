import { indexTest, roomsTest } from "./gameDesign/testLevel.js";
import { indexTutorial, roomsTutorial } from "./gameDesign/tutorial.js";

export const allRooms = [
    [roomsTutorial, indexTutorial, "Tutorial"],
    [roomsTest, indexTest, "Legacy Tutorial"]
]