// src/AddEvent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function AddEvent({ selectedDate }) {
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [events, setEvents] = useState([]);
  const [editMode, setEditMode] = useState(null);

  // Load events for the selected date
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:4000/events");
        console.log("GET /events response:", res.data);
        // server returns an array of events (each: {date, title, time})
        const allEvents = Array.isArray(res.data) ? res.data : [];
        setEvents(allEvents.filter((e) => e.date === selectedDate.toDateString()));
      } catch (err) {
        console.error("Failed to fetch events:", err);
        alert("⚠️ Could not load events. Is the backend running?");
      }
    })();
  }, [selectedDate]);

  // Add a new event
  const addEvent = async () => {
    if (!eventTitle.trim() || !eventTime.trim()) {
      alert("Please enter both title and time.");
      return;
    }
    const newEvent = {
      date: selectedDate.toDateString(),
      title: eventTitle,
      time: eventTime,
    };

    try {
      const res = await axios.post("http://localhost:4000/events", newEvent);
      console.log("POST /events response:", res.data);
      // server returns the created event (or an object). Use it if present, else fallback to newEvent
      const created = res.data && (res.data.event || res.data) ? (res.data.event || res.data) : newEvent;
      setEvents([...events, created]);
      setEventTitle("");
      setEventTime("");
      alert("✅ Event added successfully!");
    } catch (err) {
      console.error("Failed to add event:", err);
      alert("⚠️ Failed to add event. Check backend console and network.");
    }
  };

  // Delete
  const deleteEvent = async (title) => {
    try {
      const res = await axios.delete("http://localhost:4000/events", {
        data: { date: selectedDate.toDateString(), title },
      });
      console.log("DELETE /events response:", res.data);
      // if backend returns {message} assume success
      setEvents(events.filter((e) => e.title !== title));
      alert(res.data?.message || "🗑️ Event deleted!");
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("⚠️ Failed to delete event.");
    }
  };

  // Update
  const updateEvent = async (oldTitle) => {
    if (!eventTitle.trim() || !eventTime.trim()) {
      alert("Please enter both title and time to update.");
      return;
    }

    const payload = {
      date: selectedDate.toDateString(),
      oldTitle,
      newTitle: eventTitle,
      newTime: eventTime,
    };

    try {
      const res = await axios.put("http://localhost:4000/events", payload);
      console.log("PUT /events response:", res.data);
      // replace the matching event with the returned one if available
      const returned = res.data?.event || { date: payload.date, title: payload.newTitle, time: payload.newTime };
      setEvents(events.map((e) => (e.title === oldTitle ? returned : e)));
      setEditMode(null);
      setEventTitle("");
      setEventTime("");
      alert(res.data?.message || "✏️ Event updated!");
    } catch (err) {
      console.error("Failed to update event:", err);
      alert("⚠️ Failed to update event.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mt-4 text-center">
        Add / Update Event for {selectedDate.toDateString()}
      </h2>

      <div className="flex gap-2 mt-2 flex-wrap justify-center">
        <input
          type="text"
          placeholder="Enter event title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
          className="border p-2 rounded"
        />
        {editMode ? (
          <button onClick={() => updateEvent(editMode)} className="bg-green-600 text-white px-3 py-2 rounded">
            Update
          </button>
        ) : (
          <button onClick={addEvent} className="bg-blue-600 text-white px-3 py-2 rounded">
            Add Event
          </button>
        )}
      </div>

      <h3 className="text-lg font-bold mt-6 text-center">Events on {selectedDate.toDateString()}:</h3>

      {events.length === 0 ? (
        <p className="text-gray-500 text-center">No events yet.</p>
      ) : (
        <ul className="flex flex-col items-center mt-2">
          {events.map((event, index) => (
            <li key={index} className="flex items-center gap-3 bg-white p-2 rounded shadow-sm w-64 justify-between">
              <div>
                <span className="font-medium">📌 {event.title}</span>
                {event.time && <span className="block text-sm text-gray-600">⏰ {event.time}</span>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditMode(event.title);
                    setEventTitle(event.title);
                    setEventTime(event.time || "");
                  }}
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button onClick={() => deleteEvent(event.title)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AddEvent;
