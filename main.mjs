// Screeps Arena Bot Game
// Final Submission
// Objective- Capture the flag
import { getObjectsByPrototype } from "game/utils";
import {
	Creep,
	Flag,
	StructureContainer,
	StructureTower,
} from "game/prototypes";
import { RESOURCE_ENERGY, ERR_NOT_IN_RANGE } from "game/constants";

function runDefenders(defenders, enemies, container, tower, myFlag) {
	// defender logic
	for (var i = 0; i < defenders.length; i++) {
		var creep = defenders[i];
		var target = creep.findInRange(enemies, 10)[0];
		if (target) {
			// enemy spotted- shoot them
			creep.rangedAttack(target);
		}
		if (i == 0) {
			// first defender feeds the tower
			if (creep.store[RESOURCE_ENERGY] == 0) {
				if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(container);
				}
			} else {
				if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(tower);
				}
			}
		} else {
			// rest of defenders guard flag
			creep.moveTo(myFlag);
		}
	}
}

function runRunners(runners, enemies, enemyFlag) {
	// runner logics
	for (var creep of runners) {
		var target = creep.findInRange(enemies, 10)[0];
		if (target) {
			// enemy spotted- shoot them
			creep.rangedAttack(target);
		}
		// prioritize going to enemy flag
		creep.moveTo(enemyFlag);
	}
}

function runFighters(fighters, enemies, enemyFlag) {
	// fighter logic
	for (var creep of fighters) {
		var target = creep.findClosestByRange(enemies);
		// fighting only
		if (target) {
			creep.rangedAttack(target);
			creep.moveTo(target);
		} else {
			creep.moveTo(enemyFlag);
		}
	}
}

// test
export function loop() {
	var enemyFlag = getObjectsByPrototype(Flag).find((object) => !object.my);
	var myFlag = getObjectsByPrototype(Flag).find((object) => object.my);
	var myCreeps = getObjectsByPrototype(Creep).filter((object) => object.my);
	var enemies = getObjectsByPrototype(Creep).filter((object) => !object.my);
	var tower = getObjectsByPrototype(StructureTower).find((object) => object.my);
	var container = getObjectsByPrototype(StructureContainer)[0];

	// changed amount of bots @ each task for better win consistency
	runDefenders(myCreeps.slice(0, 2), enemies, container, tower, myFlag);
	runRunners(myCreeps.slice(2, 9), enemies, enemyFlag);
	runFighters(myCreeps.slice(9), enemies, enemyFlag);
}
