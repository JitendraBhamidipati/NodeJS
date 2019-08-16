const yargs = require("yargs");
const notesUtils = require("./notes");

yargs.version("1.1.0");

yargs.command({
  command: "add",
  describe: "Adding a Note",
  builder: {
    title: {
      describe: "Note Title",
      demandOption: true,
      type: "string"
    },
    body: {
      describe: "Title body",
      demandOption: true,
      type: "string"
    }
  },
  handler: args => {
    notesUtils.addNote(args.title, args.body);
  }
});

yargs.command({
  command: "remove",
  describe: "Removing a Note",
  builder: {
    title: {
      demandOption: true,
      describe: "Title to remove note",
      type: "string"
    }
  },
  handler: args => {
    notesUtils.removeNote(args.title);
  }
});

yargs.command({
  command: "read",
  describe: "Reading Note",
  builder: {
    title: {
      describe: "Reading Title",
      type: "string",
      demandOption: true
    }
  },
  handler: args => {
    notesUtils.readNote(args.title);
  }
});

yargs.command({
  command: "list",
  describe: "Listing all Notes",
  builder: {},
  handler: () => {
    notesUtils.listNotes();
  }
});

yargs.parse();
