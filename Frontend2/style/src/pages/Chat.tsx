// import React, { useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from "react";

// /**
//  * Chat page (src/pages/chat.tsx)
//  *
//  * Simple, self-contained chat UI for a React + TypeScript app.
//  * - message list with timestamps
//  * - input with Enter to send, Shift+Enter for newline
//  * - attachments (image preview)
//  * - simulated incoming reply + typing indicator
//  * - persisted to localStorage
//  *
//  * Drop this file into /src/pages/chat.tsx
//  */

// type Sender = "me" | "them";
// type Message = {
//     id: string;
//     text: string;
//     sender: Sender;
//     timestamp: number;
//     attachments?: string[]; // data URLs
// };

// const STORAGE_KEY = "chat_messages_v1";

// function formatTime(ts: number) {
//     const d = new Date(ts);
//     return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// }

// function genId() {
//     return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
// }

// export default function ChatPage(): JSIX.Element {
//     const [messages, setMessages] = useState<Message[]>(() => {
//         try {
//             const raw = localStorage.getItem(STORAGE_KEY);
//             return raw ? (JSON.parse(raw) as Message[]) : [
//                 {
//                     id: genId(),
//                     text: "Welcome! This is a demo chat. Say hi 👋",
//                     sender: "them",
//                     timestamp: Date.now(),
//                 },
//             ];
//         } catch {
//             return [];
//         }
//     });

//     const [input, setInput] = useState("");
//     const [attachments, setAttachments] = useState<string[]>([]);
//     const [isTyping, setIsTyping] = useState(false);
//     const listRef = useRef<HTMLDivElement | null>(null);
//     const inputRef = useRef<HTMLTextAreaElement | null>(null);

//     useEffect(() => {
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
//         scrollToBottom();
//     }, [messages]);

//     function scrollToBottom() {
//         requestAnimationFrame(() => {
//             if (listRef.current) {
//                 listRef.current.scrollTop = listRef.current.scrollHeight;
//             }
//         });
//     }

//     function sendMessage() {
//         const text = input.trim();
//         if (!text && attachments.length === 0) return;
//         const msg: Message = {
//             id: genId(),
//             text,
//             sender: "me",
//             timestamp: Date.now(),
//             attachments: attachments.length ? attachments.slice() : undefined,
//         };
//         setMessages((s) => [...s, msg]);
//         setInput("");
//         setAttachments([]);
//         // simulate reply
//         setIsTyping(true);
//         setTimeout(() => {
//             const reply: Message = {
//                 id: genId(),
//                 text: generateAutoReply(text),
//                 sender: "them",
//                 timestamp: Date.now(),
//             };
//             setMessages((s) => [...s, reply]);
//             setIsTyping(false);
//         }, 900 + Math.random() * 900);
//     }

//     function generateAutoReply(userText: string) {
//         if (!userText) return "Thanks for the files!";
//         if (/help|support/i.test(userText)) return "How can I help you today?";
//         if (/hi|hello|hey/i.test(userText)) return "Hello! 👋";
//         return "Got it — thanks!";
//     }

//     function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
//         if (e.key === "Enter" && !e.shiftKey) {
//             e.preventDefault();
//             sendMessage();
//         }
//     }

//     async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
//         const files = e.target.files;
//         if (!files || !files.length) return;
//         const dataUrls: string[] = [];
//         for (const f of Array.from(files)) {
//             if (f.type.startsWith("image/")) {
//                 dataUrls.push(await fileToDataUrl(f));
//             } else {
//                 // non-images: create a small placeholder text file preview
//                 dataUrls.push(await fileToDataUrl(f));
//             }
//         }
//         setAttachments((a) => [...a, ...dataUrls]);
//         if (e.currentTarget) e.currentTarget.value = ""; // reset input so same file can be reselected
//     }

//     function removeAttachment(index: number) {
//         setAttachments((a) => a.filter((_, i) => i !== index));
//     }

//     function fileToDataUrl(file: File): Promise<string> {
//         return new Promise((res, rej) => {
//             const fr = new FileReader();
//             fr.onload = () => res(String(fr.result));
//             fr.onerror = rej;
//             fr.readAsDataURL(file);
//         });
//     }

//     return (
//         <div style={styles.page}>
//             <header style={styles.header}>
//                 <div style={styles.headerTitle}>Chat</div>
//             </header>

//             <main style={styles.container}>
//                 <div ref={listRef} style={styles.messages}>
//                     {messages.map((m) => (
//                         <div
//                             key={m.id}
//                             style={{
//                                 ...styles.messageRow,
//                                 justifyContent: m.sender === "me" ? "flex-end" : "flex-start",
//                             }}
//                         >
//                             <div style={{ ...styles.bubble, ...(m.sender === "me" ? styles.bubbleMe : styles.bubbleThem) }}>
//                                 <div style={styles.messageText}>{m.text}</div>
//                                 {m.attachments?.length ? (
//                                     <div style={styles.attachments}>
//                                         {m.attachments.map((a, idx) => (
//                                             <img key={idx} src={a} alt={`attachment-${idx}`} style={styles.attachmentImg} />
//                                         ))}
//                                     </div>
//                                 ) : null}
//                                 <div style={styles.timestamp}>{formatTime(m.timestamp)}</div>
//                             </div>
//                         </div>
//                     ))}
//                     {isTyping && (
//                         <div style={{ ...styles.messageRow, justifyContent: "flex-start" }}>
//                             <div style={{ ...styles.bubble, ...styles.bubbleThem }}>
//                                 <div style={styles.typingDots}>
//                                     <span style={styles.dot} />
//                                     <span style={styles.dot} />
//                                     <span style={styles.dot} />
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <div style={styles.composer}>
//                     {attachments.length > 0 && (
//                         <div style={styles.attachPreview}>
//                             {attachments.map((a, i) => (
//                                 <div key={i} style={styles.previewItem}>
//                                     <img src={a} alt={`preview-${i}`} style={styles.previewImg} />
//                                     <button onClick={() => removeAttachment(i)} style={styles.removeBtn} aria-label="Remove attachment">
//                                         ×
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     <div style={styles.inputRow}>
//                         <textarea
//                             ref={inputRef}
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             onKeyDown={onKeyDown}
//                             placeholder="Type a message (Enter to send, Shift+Enter for newline)"
//                             style={styles.textarea}
//                             rows={1}
//                         />
//                         <div style={styles.controls}>
//                             <label style={styles.fileLabel}>
//                                 📎
//                                 <input type="file" multiple onChange={onFileChange} style={{ display: "none" }} />
//                             </label>
//                             <button onClick={sendMessage} style={styles.sendBtn} aria-label="Send message">
//                                 Send
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }

// /* Inline styles to keep the file self-contained */
// const styles: Record<string, React.CSSProperties> = {
//     page: {
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         fontFamily: "Inter, Roboto, -apple-system, Segoe UI, sans-serif",
//         background: "#f5f7fb",
//         color: "#111827",
//     },
//     header: {
//         padding: "12px 16px",
//         borderBottom: "1px solid #e6e9ef",
//         background: "#fff",
//     },
//     headerTitle: {
//         fontSize: 18,
//         fontWeight: 600,
//     },
//     container: {
//         flex: 1,
//         display: "flex",
//         flexDirection: "column",
//         padding: 12,
//     },
//     messages: {
//         flex: 1,
//         overflow: "auto",
//         padding: "12px 8px",
//         display: "flex",
//         flexDirection: "column",
//         gap: 8,
//     },
//     messageRow: {
//         display: "flex",
//         width: "100%",
//     },
//     bubble: {
//         maxWidth: "72%",
//         padding: "8px 10px",
//         borderRadius: 12,
//         boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
//     },
//     bubbleMe: {
//         background: "#DCF8C6",
//         alignSelf: "flex-end",
//         borderBottomRightRadius: 4,
//     },
//     bubbleThem: {
//         background: "#fff",
//         borderBottomLeftRadius: 4,
//     },
//     messageText: {
//         whiteSpace: "pre-wrap",
//         wordBreak: "break-word",
//     },
//     timestamp: {
//         marginTop: 6,
//         fontSize: 11,
//         color: "#6b7280",
//         textAlign: "right",
//     },
//     attachments: {
//         marginTop: 8,
//         display: "flex",
//         gap: 8,
//         flexWrap: "wrap",
//     },
//     attachmentImg: {
//         width: 140,
//         height: 100,
//         objectFit: "cover",
//         borderRadius: 8,
//         border: "1px solid #e6e9ef",
//     },
//     typingDots: {
//         display: "flex",
//         gap: 6,
//         padding: "6px 4px",
//     },
//     dot: {
//         width: 8,
//         height: 8,
//         borderRadius: "50%",
//         background: "#9ca3af",
//         display: "inline-block",
//         animation: "typing 1s infinite",
//     },
//     composer: {
//         paddingTop: 8,
//         borderTop: "1px solid #e6e9ef",
//     },
//     attachPreview: {
//         display: "flex",
//         gap: 8,
//         padding: "8px 4px",
//         overflowX: "auto",
//     },
//     previewItem: {
//         position: "relative",
//         width: 80,
//         height: 60,
//         borderRadius: 6,
//         overflow: "hidden",
//         boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
//     },
//     previewImg: {
//         width: "100%",
//         height: "100%",
//         objectFit: "cover",
//     },
//     removeBtn: {
//         position: "absolute",
//         top: -6,
//         right: -6,
//         background: "#ef4444",
//         color: "#fff",
//         border: "none",
//         width: 22,
//         height: 22,
//         borderRadius: "50%",
//         cursor: "pointer",
//         fontWeight: 700,
//         lineHeight: "22px",
//     },
//     inputRow: {
//         display: "flex",
//         gap: 8,
//         alignItems: "flex-end",
//         padding: "8px 4px",
//     },
//     textarea: {
//         flex: 1,
//         minHeight: 40,
//         maxHeight: 200,
//         resize: "none",
//         padding: "8px 10px",
//         borderRadius: 8,
//         border: "1px solid #e6e9ef",
//         fontSize: 14,
//         outline: "none",
//     },
//     controls: {
//         display: "flex",
//         gap: 8,
//         alignItems: "center",
//     },
//     fileLabel: {
//         display: "inline-flex",
//         alignItems: "center",
//         justifyContent: "center",
//         width: 40,
//         height: 40,
//         borderRadius: 8,
//         background: "#fff",
//         border: "1px solid #e6e9ef",
//         cursor: "pointer",
//         fontSize: 18,
//     },
//     sendBtn: {
//         background: "#2563eb",
//         color: "#fff",
//         border: "none",
//         padding: "8px 12px",
//         borderRadius: 8,
//         cursor: "pointer",
//     },

//     // small keyframes fallback via inline style is not available; keep animation mild.
// };

// /* Add a small runtime tweak for typing dots animation by injecting CSS rules */
// (function injectTypingKeyframes() {
//     if (typeof document === "undefined") return;
//     const id = "chat-typing-keyframes";
//     if (document.getElementById(id)) return;
//     const style = document.createElement("style");
//     style.id = id;
//     style.innerHTML = `
//         @keyframes typing {
//             0% { transform: translateY(0); opacity: 0.3; }
//             30% { transform: translateY(-3px); opacity: 1; }
//             60% { transform: translateY(0); opacity: 0.6; }
//             100% { transform: translateY(0); opacity: 0.3; }
//         }
//         .chat-dot-0 { animation-delay: 0s; }
//         .chat-dot-1 { animation-delay: 0.12s; }
//         .chat-dot-2 { animation-delay: 0.24s; }
//     `;
//     document.head.appendChild(style);
// })();