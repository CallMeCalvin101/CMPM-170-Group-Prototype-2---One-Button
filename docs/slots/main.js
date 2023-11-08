title = "SLOTS";

description = `Gamble`;

characters = [];

const G = {
  WIDTH: 100,
  HEIGHT: 100,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
};

const SLOT = [1, 2, 3, 4, 5, 6, 7];
const NUM_COLUMNS = 3;
const SLOT_START_POS = 40;
const SLOT_Y_OFFSET = G.HEIGHT / 2;
const SLOT_SPACING = 10;
const DELAY = 25;
const SPEED_FACTOR = 5;

// JSDoc comments for typing
/**
 * @typedef {{
 * items: number[],
 * result: number,
 * locked: boolean
 * }} SlotColumn
 */

/**
 * @type { SlotColumn[] }
 */
let slotGame;

/**
 * @type { text[] }
 */
let slotDisplay;

/**
 * @type { Map.<string, number> }
 */
let payOutKey;

let curColumn = 0;
let curTimer = DELAY;
let curBonus = -1;

function update() {
  if (!ticks) {
    initializePayouts();
    initializeSlotProperties();
  }
  spinSlots();
  drawSlots();

  if (input.isJustPressed) {
    stopSlots();
  }
}

function initializeSlotProperties() {
  slotGame = times(3, () => {
    return {
      items: SLOT,
      result: 0,
      locked: false,
    };
  });
}

function initializePayouts() {
  payOutKey = new Map();
  for (let i = 1; i < SLOT.length + 1; i++) {
    const key = `${i}${i}${i}`;
    payOutKey.set(key, 100);
    console.log(key);
  }
}

function drawSlots() {
  for (let i = 0; i < slotGame.length; i++) {
    // text(
    //   slotGame[i].items[slotGame[i].result].toString(),
    //   SLOT_START_POS + SLOT_SPACING * i,
    //   SLOT_Y_OFFSET
    // );

    let character = String.fromCharCode(
      96 + slotGame[i].items[slotGame[i].result]
    );

    char(character, vec(SLOT_START_POS + SLOT_SPACING * i, SLOT_Y_OFFSET));
  }
}

function spinSlots() {
  if (curTimer > 0) {
    curTimer -= 1;
  } else {
    for (let col of slotGame) {
      if (!col.locked) {
        col.result += 1;
        if (col.result >= col.items.length) {
          col.result = 0;
        }
      }
    }
    curTimer = DELAY - SPEED_FACTOR * curColumn;
  }
}

function stopSlots() {
  if (curColumn >= 3) {
    parseMatch();
    resetSlots();
    return;
  }

  slotGame[curColumn].locked = true;
  curColumn += 1;
}

function parseMatch() {
  let curMatch = "";
  for (let col of slotGame) {
    curMatch += col.items[col.result].toString();
  }

  if (payOutKey.has(curMatch)) {
    addScore(payOutKey.get(curMatch));
  }
}

function resetSlots() {
  for (let col of slotGame) {
    col.result = col.items[0];
    col.locked = false;
  }

  curColumn = 0;
}
