const Modal = ({ children, isModalOpen, closeModal, loading }) => {
  return (
    <div
      onClick={closeModal}
      className={`fixed top-0 left-0 w-full min-h-screen ${
        loading ? "z-[999]" : "z-50"
      } bg-[#0c0a0980] justify-center items-center transtion-opacity duration-300 ${
        isModalOpen ? "flex opacity-100" : "hidden opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

export default Modal;
