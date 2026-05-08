import Image from "next/image";
import ClientLogger from './ClientLogger';
import Link from "next/link";

export default function Home() {
  console.log("Секретний ключ:", process.env.SPACE_API_SECRET);
  console.log("Планета за замовчуванням:", process.env.NEXT_PUBLIC_DEFAULT_PLANET);

  return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-900">
        <h1 className="text-5xl font-bold mb-4 text-blue-400">
          Вітаємо у {process.env.NEXT_PUBLIC_APP_NAME}!
        </h1>
        <p className="mb-8 text-xl text-gray-300">
          Ваш особистий бортовий журнал для дослідження Всесвіту.
        </p>

        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 mb-8 max-w-md w-full">
          <h2 className="text-xl mb-4 text-white font-bold">Активні змінні середовища:</h2>
          <ul className="text-left space-y-2 text-gray-300">
            <li><strong>Додаток:</strong> {process.env.NEXT_PUBLIC_APP_NAME}</li>
            <li><strong>Планета:</strong> {process.env.NEXT_PUBLIC_DEFAULT_PLANET}</li>
            <li className="text-red-400">
              <strong>Секретний ключ:</strong> {process.env.SPACE_API_SECRET ? 'Захищено на сервері' : 'Не знайдено'}
            </li>
          </ul>
        </div>

        <Link
            href="/articles"
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition"
        >
          Перейти до відкриттів
        </Link>

        <ClientLogger />
    </div>
  );
}
