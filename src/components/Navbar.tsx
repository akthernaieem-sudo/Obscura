type NavbarProps = {
  onLogout: () => void
}

export default function Navbar({
  onLogout,
}: NavbarProps) {
  return (
    <div className="flex justify-end">
      <button
        onClick={onLogout}
        className="border border-white/10 hover:border-white/20 px-5 py-3 rounded-2xl transition bg-white/[0.03] hover:bg-white/[0.05]"
      >
        Logout
      </button>
    </div>
  )
}