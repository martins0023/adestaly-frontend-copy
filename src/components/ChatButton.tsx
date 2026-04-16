import { MessageCircle } from "lucide-react";

const ChatButton = () => {
  return (
    <a
      href="https://kitaodola.zapier.app"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9990] group"
      aria-label="Open Support Chat"
    >
      {/* Tooltip / Label that appears on hover */}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
        Need Help?
      </span>

      {/* The Button Structure */}
      <div className="relative">
        {/* Hard Shadow Layer */}
        <div className="absolute inset-0 bg-black rounded-full translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
        
        {/* Main Button Layer */}
        <div className="relative w-14 h-14 bg-primary border-2 border-black rounded-full flex items-center justify-center transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 group-active:translate-y-0 group-active:translate-x-0">
          <MessageCircle className="w-7 h-7 text-black fill-white" strokeWidth={2.5} />
          
          {/* Notification Dot (Optional visual flair) */}
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-black rounded-full animate-pulse" />
        </div>
      </div>
    </a>
  );
};

export default ChatButton;