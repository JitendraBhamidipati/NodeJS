const fs = require("fs");
const chalk = require("chalk");

const addNote = (title, body) => {
  const notes = getNotes();
  const index = notes.findIndex(item => item.title === title);
  if (index === -1) {
    notes.push({
      title,
      body
    });
    saveNotes(notes);
    console.log(chalk.bgGreen("New note added..!!"));
  } else {
    console.log(chalk.bgRed("Note already Exists..!!"));
    console.log(notes[index]);
  }
};

const saveNotes = notes => {
  fs.writeFileSync("notes.json", JSON.stringify(notes));
};

const getNotes = () => {
  try {
    const notesBuffer = fs.readFileSync("notes.json");
    const notesJSON = notesBuffer.toString();
    return JSON.parse(notesJSON);
  } catch (e) {
    return [];
  }
};

const removeNote = title => {
  let notes = getNotes();
  const prevlength = notes.length;
  notes = notes.filter(item => item.title !== title);
  if (prevlength === notes.length) {
    console.log(chalk.bgRed("Note doesn't Existed"));
  } else {
    saveNotes(notes);
    console.log(chalk.bgGreen("Note removed successfully..!!"));
  }
};

const listNotes = () => {
  let notes = getNotes();
  console.log(chalk.blue.inverse.bold("Your Notes: "));
  notes.forEach((item, index) =>
    console.log(
      chalk.bold.green(`Your title${index + 1}: `) + chalk.green(item.title)
    )
  );
};

const readNote = title => {
  let notes = getNotes();
  const note = notes.find(item => item.title === title);
  if (note) {
    console.log(chalk.bgGreen(`Title: ${chalk.bold(note.title)}`));
    console.log(`Body: ${note.body}`);
  } else {
    console.log(chalk.bgRed("No Record Found"));
  }
};

module.exports = {
  addNote,
  removeNote,
  listNotes,
  readNote
};
