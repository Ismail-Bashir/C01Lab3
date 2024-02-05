
import React, { useState } from 'react';

const App = () => {
  const [notes, setNotes] = useState([]); 
  const [status, setStatus] = useState('');

  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`/deleteNote/${noteId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete note.');
      }
      setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      alert('Note deleted successfully.');
    } catch (error) {
      console.error(error);
      alert('Error deleting note.');
    }
  };

  const editNote = async (noteId, newTitle, newContent) => {
    try {
      const response = await fetch(`/editNote/${noteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle, content: newContent })
      });
      if (!response.ok) {
        throw new Error('Failed to update note.');
      }
      const updatedNote = await response.json();
      setNotes(prevNotes => prevNotes.map(note => note._id === noteId ? { ...note, ...updatedNote } : note));
      setStatus('Note updated successfully.');
    } catch (error) {
      console.error(error);
      setStatus('Error updating note.');
    }
  };

  const deleteAllNotes = async () => {
    try {
      const response = await fetch('/deleteAllNotes', { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete all notes.');
      }
      const result = await response.json();
      setNotes([]); // Clear all notes from the state
      alert(`${result.response} Note(s) deleted successfully.`);
    } catch (error) {
      console.error(error);
      alert('Error deleting all notes.');
    }
  };

  // Render your notes and other components here
  return (
    <div>
      <h1>Notes</h1>
      {status && <p>{status}</p>}
      {notes.map(note => (
        <div key={note._id}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          <button onClick={() => editNote(note._id, note.title, note.content)}>Edit</button>
          <button onClick={() => deleteNote(note._id)}>Delete</button>
        </div>
      ))}
      <button onClick={deleteAllNotes}>Delete All Notes</button>
    </div>
  );
};

export default App;
