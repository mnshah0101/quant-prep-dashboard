"use client";
import React, { useState, useEffect } from "react";

import {
  AlertCircle,
  Book,
  Code,
  Calculator,
  ChartBar,
  StickyNote,
  Edit2, // Lucide icon for editing
  Trash2, // Lucide icon for delete
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Utility function to compute days between two dates
function daysBetween(nowDate, targetDate) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = targetDate.getTime() - nowDate.getTime();
  return Math.ceil(diff / msPerDay);
}

export default function QuantPrepDashboard() {
  // -------------------------------------
  // States
  // -------------------------------------
  const [notes, setNotes] = useState("");
  const [books, setBooks] = useState([]);
  const [leetcodeDaily, setLeetcodeDaily] = useState([]); // [{ date: 'YYYY-MM-DD', solved: number }]
  const [quantGuideDaily, setQuantGuideDaily] = useState([]); // same shape
  const [zetamacScores, setZetamacScores] = useState([]);

  // For adding new book
  const [newBook, setNewBook] = useState({
    title: "",
    currentPage: 0,
    totalPages: 0,
    targetFinishDate: "",
  });

  // For adding today's solves
  const [todayLeetCodeSolved, setTodayLeetCodeSolved] = useState(0);
  const [todayQuantGuideSolved, setTodayQuantGuideSolved] = useState(0);

  // -------------------------------------
  // Local Storage Reads
  // -------------------------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNotes = localStorage.getItem("quantPrepNotes");
      const savedBooks = localStorage.getItem("quantPrepBooks");
      const savedLeetcodeDaily = localStorage.getItem("quantPrepLeetcodeDaily");
      const savedQuantGuideDaily = localStorage.getItem(
        "quantPrepQuantGuideDaily"
      );
      const savedZetamac = localStorage.getItem("quantPrepZetamac");

      if (savedNotes) setNotes(savedNotes);
      if (savedBooks) setBooks(JSON.parse(savedBooks));
      if (savedLeetcodeDaily) setLeetcodeDaily(JSON.parse(savedLeetcodeDaily));
      if (savedQuantGuideDaily)
        setQuantGuideDaily(JSON.parse(savedQuantGuideDaily));
      if (savedZetamac) setZetamacScores(JSON.parse(savedZetamac));
    }
  }, []);

  // -------------------------------------
  // Local Storage Writes
  // -------------------------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quantPrepNotes", notes);
    }
  }, [notes]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quantPrepBooks", JSON.stringify(books));
    }
  }, [books]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "quantPrepLeetcodeDaily",
        JSON.stringify(leetcodeDaily)
      );
    }
  }, [leetcodeDaily]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "quantPrepQuantGuideDaily",
        JSON.stringify(quantGuideDaily)
      );
    }
  }, [quantGuideDaily]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quantPrepZetamac", JSON.stringify(zetamacScores));
    }
  }, [zetamacScores]);

  // -------------------------------------
  // Overall Progress
  // -------------------------------------
  const calculateTotalProgress = () => {
    // Books progress (average percentage)
    const bookProgress =
      books.reduce((acc, book) => {
        if (!book.totalPages) return acc;
        return acc + (book.currentPage / book.totalPages) * 100;
      }, 0) / (books.length || 1);

    // Summation of daily solves in leetcodeDaily
    const totalLeetSolves = leetcodeDaily.reduce(
      (acc, day) => acc + day.solved,
      0
    );
    const leetGoal = 200;
    const leetcodeProgress = Math.min((totalLeetSolves / leetGoal) * 100, 100);

    // Summation of daily solves in quantGuideDaily
    const totalQuantGuideSolves = quantGuideDaily.reduce(
      (acc, day) => acc + day.solved,
      0
    );
    const quantGoal = 100;
    const quantGuideProgress = Math.min(
      (totalQuantGuideSolves / quantGoal) * 100,
      100
    );

    // Weighted equally for demonstration
    return (bookProgress + leetcodeProgress + quantGuideProgress) / 3;
  };

  // -------------------------------------
  // Books
  // -------------------------------------
  const addBook = () => {
    if (newBook.title && newBook.totalPages > 0) {
      setBooks([...books, { ...newBook }]);
      setNewBook({
        title: "",
        currentPage: 0,
        totalPages: 0,
        targetFinishDate: "",
      });
    }
  };

  const updateBookProgress = (index, currentPage) => {
    const updatedBooks = [...books];
    updatedBooks[index].currentPage = currentPage;
    setBooks(updatedBooks);
  };

  const computePagesPerDayForBook = (book) => {
    if (!book.targetFinishDate) return 0;
    const now = new Date();
    const targetDate = new Date(book.targetFinishDate);
    if (isNaN(targetDate.getTime()) || targetDate <= now) {
      return 0;
    }
    const pagesLeft = book.totalPages - book.currentPage;
    if (pagesLeft <= 0) return 0;
    const daysLeft = daysBetween(now, targetDate);
    return pagesLeft / daysLeft;
  };

  const pieColors = ["#82ca9d", "#8884d8"];

  // -------------------------------------
  // LeetCode (Daily Solves)
  // -------------------------------------
  const logTodayLeetCode = () => {
    if (todayLeetCodeSolved > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const newDaily = [...leetcodeDaily];
      const existingIndex = newDaily.findIndex((d) => d.date === today);
      if (existingIndex >= 0) {
        newDaily[existingIndex].solved += todayLeetCodeSolved;
      } else {
        newDaily.push({ date: today, solved: todayLeetCodeSolved });
      }
      setLeetcodeDaily(newDaily);
      setTodayLeetCodeSolved(0);
    }
  };

  const leetcodeChartData = [...leetcodeDaily].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // -------------------------------------
  // QuantGuide (Daily Solves)
  // -------------------------------------
  const logTodayQuantGuide = () => {
    if (todayQuantGuideSolved > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const newDaily = [...quantGuideDaily];
      const existingIndex = newDaily.findIndex((d) => d.date === today);
      if (existingIndex >= 0) {
        newDaily[existingIndex].solved += todayQuantGuideSolved;
      } else {
        newDaily.push({ date: today, solved: todayQuantGuideSolved });
      }
      setQuantGuideDaily(newDaily);
      setTodayQuantGuideSolved(0);
    }
  };

  const quantGuideChartData = [...quantGuideDaily].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // -------------------------------------
  // Zetamac
  // -------------------------------------
  const addZetamacScore = (score) => {
    const newScores = [...zetamacScores, score];
    setZetamacScores(newScores);
  };

  const zetamacChartData = zetamacScores.map((score, index) => ({
    name: `Run #${index + 1}`,
    score,
  }));

  // -------------------------------------
  // Pop-up Modal for Editing All Data
  // -------------------------------------
  const [showModal, setShowModal] = useState(false);

  // Ephemeral states for the modal
  const [editNotes, setEditNotes] = useState("");
  const [editBooks, setEditBooks] = useState([]);
  const [editLeetDaily, setEditLeetDaily] = useState([]);
  const [editQuantDaily, setEditQuantDaily] = useState([]);
  const [editZetamac, setEditZetamac] = useState([]);

  const openModal = () => {
    setEditNotes(notes);
    setEditBooks(JSON.parse(JSON.stringify(books)));
    setEditLeetDaily(JSON.parse(JSON.stringify(leetcodeDaily)));
    setEditQuantDaily(JSON.parse(JSON.stringify(quantGuideDaily)));
    setEditZetamac(JSON.parse(JSON.stringify(zetamacScores)));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const saveModal = () => {
    // commit ephemeral states back
    setNotes(editNotes);
    setBooks(editBooks);
    setLeetcodeDaily(editLeetDaily);
    setQuantGuideDaily(editQuantDaily);
    setZetamacScores(editZetamac);
    setShowModal(false);
  };

  // Book addition in modal
  const addBookInModal = () => {
    setEditBooks([
      ...editBooks,
      {
        title: "New Book",
        currentPage: 0,
        totalPages: 100,
        targetFinishDate: "",
      },
    ]);
  };

  // Book removal in modal
  const removeBookInModal = (idx) => {
    const cloned = [...editBooks];
    cloned.splice(idx, 1);
    setEditBooks(cloned);
  };

  // -------------------------------------
  // Render
  // -------------------------------------
  return (
  
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Quant Preparation Dashboard
        <Button className="mx-5" variant="outline" onClick={openModal}>
          <Edit2 className="mr-2" /> Edit All Data
        </Button>
      </h1>

      {/* Overall Progress */}
      <Card className="mb-6 w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChartBar className="mr-2" /> Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={calculateTotalProgress()} className="w-full" />
          <p className="text-sm text-gray-500 mt-2">
            {calculateTotalProgress().toFixed(2)}% Complete
          </p>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card className="mb-6 w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <StickyNote className="mr-2" /> Notes / Daily Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            placeholder="Write down tasks or notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Books (top-left) */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Book className="mr-2" /> Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add New Book */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Input
                placeholder="Title"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                className="w-40"
              />
              <Input
                type="number"
                placeholder="Total Pages"
                value={newBook.totalPages}
                onChange={(e) =>
                  setNewBook({
                    ...newBook,
                    totalPages: parseInt(e.target.value) || 0,
                  })
                }
                className="w-28"
              />
              <Input
                type="number"
                placeholder="Current Page"
                value={newBook.currentPage}
                onChange={(e) =>
                  setNewBook({
                    ...newBook,
                    currentPage: parseInt(e.target.value) || 0,
                  })
                }
                className="w-28"
              />
              <Input
                type="date"
                value={newBook.targetFinishDate || ""}
                onChange={(e) =>
                  setNewBook({ ...newBook, targetFinishDate: e.target.value })
                }
              />
              <Button onClick={addBook}>Add Book</Button>
            </div>

            {/* Books List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {books.map((book, index) => {
                const { title, currentPage, totalPages, targetFinishDate } =
                  book;
                const pagesRead = currentPage;
                const pagesRemaining = Math.max(totalPages - currentPage, 0);
                const pieData = [
                  { name: "Read", value: pagesRead },
                  { name: "Remaining", value: pagesRemaining },
                ];
                const ppd = computePagesPerDayForBook(book);
                const ppdDisplay = ppd ? ppd.toFixed(2) : 0;

                return (
                  <div key={index} className="border p-2 rounded flex flex-col">
                    <h3 className="font-bold mb-2">{title}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <Input
                        type="number"
                        placeholder="Current Page"
                        value={currentPage}
                        onChange={(e) =>
                          updateBookProgress(
                            index,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-20"
                      />
                      <span className="text-sm text-gray-500">
                        / {totalPages}
                      </span>
                    </div>
                    <Input
                      type="date"
                      value={targetFinishDate || ""}
                      onChange={(e) => {
                        const updated = [...books];
                        updated[index].targetFinishDate = e.target.value;
                        setBooks(updated);
                      }}
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-500 mb-2">
                      Pages/Day: {ppdDisplay}
                    </p>

                    <div style={{ width: "100%", height: 150 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={50}
                            fill="#8884d8"
                            label
                          >
                            {pieData.map((entry, idx) => (
                              <Cell
                                key={`cell-${idx}`}
                                fill={pieColors[idx % pieColors.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* LeetCode (top-right) */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="mr-2" /> LeetCode Daily Solves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                type="number"
                placeholder="Today's solves"
                value={todayLeetCodeSolved}
                onChange={(e) =>
                  setTodayLeetCodeSolved(parseInt(e.target.value) || 0)
                }
                className="w-24"
              />
              <Button onClick={logTodayLeetCode}>Log Today</Button>
            </div>

            {leetcodeDaily.length > 0 && (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={leetcodeChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="solved"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* QuantGuide (bottom-left) */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2" /> QuantGuide Daily Solves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                type="number"
                placeholder="Today's solves"
                value={todayQuantGuideSolved}
                onChange={(e) =>
                  setTodayQuantGuideSolved(parseInt(e.target.value) || 0)
                }
                className="w-24"
              />
              <Button onClick={logTodayQuantGuide}>Log Today</Button>
            </div>

            {quantGuideDaily.length > 0 && (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={quantGuideChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="solved"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Zetamac (bottom-right) */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2" /> Zetamac Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                type="number"
                placeholder="Zetamac Score"
                id="zetamacScore"
              />
              <Button
                onClick={() => {
                  const scoreInput = document.getElementById("zetamacScore");
                  if (scoreInput && scoreInput.value) {
                    addZetamacScore(parseInt(scoreInput.value));
                    scoreInput.value = "";
                  }
                }}
              >
                Add Score
              </Button>
            </div>

            {zetamacScores.length > 0 && (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={zetamacChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal for Editing All Data */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded p-4 w-full max-w-4xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Edit All Data</h2>

            {/* NOTES */}
            <div className="mb-4">
              <label className="font-semibold block mb-1">Notes</label>
              <textarea
                className="w-full border p-2 rounded"
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
              />
            </div>

            {/* BOOKS */}
            <div className="mb-4">
              <label className="font-semibold block mb-2">Books</label>
              <Button variant="outline" size="sm" onClick={addBookInModal}>
                Add Book
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {editBooks.map((b, i) => (
                  <div key={i} className="border p-2 rounded relative">
                    {/* Delete Book Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeBookInModal(i)}
                    >
                      <Trash2 className="mr-1" size={16} />
                      Delete
                    </Button>

                    <Input
                      placeholder="Title"
                      value={b.title}
                      onChange={(e) => {
                        const cloned = [...editBooks];
                        cloned[i].title = e.target.value;
                        setEditBooks(cloned);
                      }}
                      className="mb-2"
                    />
                    <div className="flex gap-2 mb-2">
                      <Input
                        type="number"
                        placeholder="Current Page"
                        value={b.currentPage}
                        onChange={(e) => {
                          const cloned = [...editBooks];
                          cloned[i].currentPage = parseInt(e.target.value) || 0;
                          setEditBooks(cloned);
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Total Pages"
                        value={b.totalPages}
                        onChange={(e) => {
                          const cloned = [...editBooks];
                          cloned[i].totalPages = parseInt(e.target.value) || 0;
                          setEditBooks(cloned);
                        }}
                      />
                    </div>
                    <Input
                      type="date"
                      value={b.targetFinishDate || ""}
                      onChange={(e) => {
                        const cloned = [...editBooks];
                        cloned[i].targetFinishDate = e.target.value;
                        setEditBooks(cloned);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* LEETCODE DAILY */}
            <div className="mb-4">
              <label className="font-semibold block mb-2">LeetCode Daily</label>
              <div className="space-y-2">
                {editLeetDaily.map((ld, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      type="date"
                      value={ld.date}
                      onChange={(e) => {
                        const cloned = [...editLeetDaily];
                        cloned[idx].date = e.target.value;
                        setEditLeetDaily(cloned);
                      }}
                    />
                    <Input
                      type="number"
                      value={ld.solved}
                      onChange={(e) => {
                        const cloned = [...editLeetDaily];
                        cloned[idx].solved = parseInt(e.target.value) || 0;
                        setEditLeetDaily(cloned);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* QUANTGUIDE DAILY */}
            <div className="mb-4">
              <label className="font-semibold block mb-2">
                QuantGuide Daily
              </label>
              <div className="space-y-2">
                {editQuantDaily.map((qd, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      type="date"
                      value={qd.date}
                      onChange={(e) => {
                        const cloned = [...editQuantDaily];
                        cloned[idx].date = e.target.value;
                        setEditQuantDaily(cloned);
                      }}
                    />
                    <Input
                      type="number"
                      value={qd.solved}
                      onChange={(e) => {
                        const cloned = [...editQuantDaily];
                        cloned[idx].solved = parseInt(e.target.value) || 0;
                        setEditQuantDaily(cloned);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ZETAMAC */}
            <div className="mb-4">
              <label className="font-semibold block mb-2">Zetamac Scores</label>
              <div className="space-y-2">
                {editZetamac.map((zs, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      type="number"
                      value={zs}
                      onChange={(e) => {
                        const cloned = [...editZetamac];
                        cloned[idx] = parseInt(e.target.value) || 0;
                        setEditZetamac(cloned);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={saveModal}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
