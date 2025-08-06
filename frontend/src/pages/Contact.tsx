
const Contact = () => {
  return (
    <section className="min-h-screen  px-6 py-16 text-green-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-800 mb-6">
          Get in <span className="text-green-600">Touch</span>
        </h1>
        <p className="text-lg mb-10 leading-relaxed">
          Have a question, collab idea, or just wanna say hey? We're all ears 🍵  
          Hit us up and we'll get back to you ASAP!
        </p>

        <form className="bg-white p-8 rounded-xl shadow-md grid gap-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="border border-green-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border border-green-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <textarea
            placeholder="Your Message"
            rows={5}
            className="border border-green-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 transition text-white font-medium py-3 rounded-md"
          >
            Send Message
          </button>
        </form>

        <div className="mt-16 grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">📍 Our Location</h2>
            <p>Kyoto HQ 🌿</p>
            <p>123 Matcha Lane, Kyoto, Japan</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">📧 Support</h2>
            <p>support@justmatcha.com</p>
            <p className="mt-1">We typically reply within 24 hours ✉️</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
