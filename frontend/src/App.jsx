import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const App = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState("");
  const [newTime, setNewTime] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedTime, setEditedTime] = useState("");
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // ✅ Animated alert messages
  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setVisible(true);
    setTimeout(() => setVisible(false), 2000);
    setTimeout(() => setMessage(null), 2500);
  };

  const validateEvent = (title, time) => {
    if (!title.trim()) {
      showMessage("⚠️ Event title cannot be empty!", "error");
      return false;
    }
    if (!time) {
      showMessage("⚠️ Please select a valid time!", "error");
      return false;
    }
    const isDuplicate = events.some(
      (e) =>
        e.date === date.toDateString() &&
        e.title.toLowerCase() === title.trim().toLowerCase() &&
        e.time === time
    );
    if (isDuplicate) {
      showMessage("⚠️ Event already exists for this time!", "error");
      return false;
    }
    return true;
  };

  const handleAddEvent = async () => {
    if (!validateEvent(newEvent, newTime)) return;

    const event = {
      date: date.toDateString(),
      title: newEvent.trim(),
      time: newTime,
    };

    try {
      const res = await fetch("http://localhost:4000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });

      if (res.ok) {
        showMessage("🎉 Event added successfully!", "success");
        setEvents([...events, event]);
        setNewEvent("");
        setNewTime("");
      } else {
        showMessage("❌ Failed to add event", "error");
      }
    } catch (err) {
      console.error("Error adding event:", err);
      showMessage("⚠️ Server error — check backend!", "error");
    }
  };

  const handleDeleteEvent = async (title) => {
    try {
      const res = await fetch("http://localhost:4000/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: date.toDateString(), title }),
      });

      if (res.ok) {
        showMessage("🗑️ Event deleted!", "success");
        setEvents(
          events.filter(
            (e) => !(e.date === date.toDateString() && e.title === title)
          )
        );
      } else {
        showMessage("❌ Failed to delete event", "error");
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      showMessage("⚠️ Server error — check backend!", "error");
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEditedTitle(event.title);
    setEditedTime(event.time || "");
  };

  const handleUpdateEvent = async () => {
    if (!validateEvent(editedTitle, editedTime)) return;

    try {
      const res = await fetch("http://localhost:4000/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: editingEvent.date,
          oldTitle: editingEvent.title,
          newTitle: editedTitle.trim(),
          newTime: editedTime,
        }),
      });

      if (res.ok) {
        const updatedEvent = await res.json();
        setEvents(
          events.map((e) =>
            e.date === editingEvent.date && e.title === editingEvent.title
              ? updatedEvent.event
              : e
          )
        );
        setEditingEvent(null);
        showMessage("✅ Event updated successfully!", "success");
      } else {
        showMessage("❌ Failed to update event", "error");
      }
    } catch (err) {
      console.error("Error updating event:", err);
      showMessage("⚠️ Server error — check backend!", "error");
    }
  };

  const eventsForDate = events.filter((e) => e.date === date.toDateString());

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col items-center p-8 relative overflow-hidden">
      <h1 className="text-4xl font-bold text-blue-800 mb-6 flex items-center gap-2 drop-shadow-sm">
        📅 My Calendar
      </h1>

      {/* ✅ Animated Alert Message */}
      {message && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded-lg text-white font-medium shadow-lg transform transition-all duration-500 ease-in-out
            ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-6 pointer-events-none"
            }
            ${
              message.type === "success"
                ? "bg-green-500"
                : message.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white shadow-xl p-6 rounded-2xl">
        <Calendar onChange={setDate} value={date} />
      </div>

      <div className="mt-6 text-center w-full max-w-md">
        <h2 className="text-lg font-semibold">
          Selected date:{" "}
          <span className="font-bold text-blue-700">
            {date.toDateString()}
          </span>
        </h2>

        {/* Add Event Section */}
        <div className="mt-4 flex gap-2 justify-center">
          <input
            type="text"
            placeholder="Enter event title"
            className="border p-2 rounded w-1/2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
          />
          <input
            type="time"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
          <button
            onClick={handleAddEvent}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>

        {/* Events List */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-gray-700">
            Events on {date.toDateString()}:
          </h3>

          {eventsForDate.length === 0 ? (
            <p className="text-gray-600">No events for this date.</p>
          ) : (
            <ul className="space-y-2">
              {eventsForDate.map((event, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-pink-100 p-3 rounded-lg shadow-sm"
                >
                  {editingEvent && editingEvent.title === event.title ? (
                    <>
                      <input
                        type="text"
                        className="border p-1 rounded mr-2 w-1/3"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                      />
                      <input
                        type="time"
                        className="border p-1 rounded mr-2"
                        value={editedTime}
                        onChange={(e) => setEditedTime(e.target.value)}
                      />
                      <button
                        onClick={handleUpdateEvent}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-800 font-medium">
                        📌 {event.title}{" "}
                        {event.time && (
                          <span className="text-gray-500 text-sm">
                            at {event.time}
                          </span>
                        )}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.title)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
