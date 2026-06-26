import Link from "next/link";

const Home = async () => {
  const user = true;
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Team access control demo
      </h1>
      <p className="text-slate-300 mb-8">
        This is a demo site for team managemnet.
      </p>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 p-6 border border-slate-700 rounded-lg">
          <h3 className="font-semibold mb-3 text-white">
            Feature Demonstrated
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
            <li>Role-based access control (RBAC)</li>
            <li>Route protection with middleware</li>
            <li>Server-side permission checks</li>
            <li>Client-side permission hooks</li>
            <li>Dynamic routes access</li>
          </ul>
        </div>
        <div className="bg-slate-800 p-6 border border-slate-700 rounded-lg">
          <h3 className="font-semibold mb-3 text-white">User roles</h3>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>
              <strong>Super Admin: </strong>Full system access
            </li>
            <li>
              <strong>Admin: </strong>User and team management.
            </li>
            <li>
              <strong>Manager: </strong>Team specific information.
            </li>
            <li>
              <strong>User: </strong>Basic Dashboard.
            </li>
          </ul>
        </div>
      </div>
      {user ? (
        <div className="bg-green-900/30 border-green-300 rounded-lg p-4">
          <p className="text-green-300 ">
            Welcome back, <strong>Imran</strong>! you logged in as{" "}
            <strong className="text-green-200">Admin</strong>
          </p>
          <Link
            href={"/dashboard"}
            className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="bg-blue-900/30 border-blue-300 rounded-lg p-4">
          <p className="text-slate-300 mb-3">you logged in.</p>
          <div className="space-x-3 mt-3">
            <Link
              href={"/login"}
              className=" px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              href={"/register"}
              className=" px-4 py-2 border border-slate-600  text-slate-300 rounded transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
