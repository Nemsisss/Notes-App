type NoteProps = {
  note: {
    id: number;
    title: string;
    content: string;
  };
  handleNoteCl: (note: { id: number; title: string; content: string }) => void;
  delNote: (event: React.MouseEvent<HTMLButtonElement>, id: number) => void;
};

const Note: React.FC<NoteProps> = (props) => {
  return (
    <div
      className="note-item"
      key={props.note.id}
      onClick={() => props.handleNoteCl(props.note)}
    >
      <div className="notes-header">
        <button onClick={(event) => props.delNote(event, props.note.id)}>
          x
        </button>
      </div>
      <h2>{props.note.title}</h2>
      <p>{props.note.content}</p>
    </div>
  );
};

export default Note;
