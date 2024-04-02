import "./App.css";
import { useEffect, useState } from "react";
import Note from "./components/note/note";

type Note = {
  id: number;
  title: string;
  content: string;
};

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    // react does not like the useEffect itself to be an async function, thus put the code inside an async func
    const fetchNotes = async () => {
      try {
        // fetch by default does a get request
        const response = await fetch("http://localhost:5000/api/notes");
        const notes: Note[] = await response.json();
        console.log(notes);
        setNotes(notes);
      } catch (e) {
        console.log(e);
      }
    };
    fetchNotes();
  }, []);
  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNote) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );
      const updatedNote = await response.json();
      const updatedNotesList = notes.map((note) =>
        note.id === selectedNote.id ? updatedNote : note
      );
      setNotes(updatedNotesList);
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };
  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      const newNote = await response.json();
      // update notes
      setNotes([newNote, ...notes]);
      // clear form values
      setTitle("");
      setContent("");
    } catch (e) {
      console.log(e);
    }
  };
  const deleteNote = async (event: React.MouseEvent, noteId: number) => {
    //this line stops the clickNote event from intervening with this event
    // this is necessary for nested onClick events
    event.stopPropagation();
    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="app-container">
      <form
        className="note-form"
        onSubmit={(event) =>
          selectedNote ? handleUpdateNote(event) : handleAddNote(event)
        }
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="title"
          required
        ></input>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Content"
          rows={10}
          required
        ></textarea>
        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>

      <div className="notes-grid">
        {notes.map((note) => (
          <Note
            handleNoteCl={handleNoteClick}
            delNote={deleteNote}
            note={note}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
