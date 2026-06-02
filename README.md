 # Board Game Cafe Management System

  **Факултетен номер:** 2401321084
  **Тема:** Board Game Cafe Management System
  **Описание:** Система за управление на кафе-клуб за настолни игри. Включва каталог с игри, управление на маси и система за резервации.

  Test user
  |customer1
  |customer@gmail.com
  |customer123
  ---

  ## Технологичен стек

  | Слой | Технология |
  |------|-----------|
  | Back-end | ASP.NET Core 9 Web API, C# |
  | База данни | SQL Server (MSSQLLocalDB) + Entity Framework Core 9 |
  | Автентикация | JWT Bearer Token |
  | Документация | Swagger / OpenAPI |
  | Front-end | React 19 + TypeScript (Vite), SPA |

  ---

  ## Структура на базата данни

  ### `Users`
  | Колона | Тип | Описание |
  |--------|-----|---------|
  | Id | int (PK) | Идентификатор |
  | Username | string (max 50) | Потребителско име |
  | Email | string (max 100) | Имейл (уникален) |
  | PasswordHash | string | BCrypt хеш |
  | Role | string (max 20) | Admin / Customer |
  | CreatedAt | DateTime | Дата на регистрация |
  | IsActive | bool | Активен акаунт |

  ### `BoardGames`
  | Колона | Тип | Описание |
  |--------|-----|---------|
  | Id | int (PK) | Идентификатор |
  | Title | string (max 100) | Заглавие |
  | Genre | string (max 50) | Жанр |
  | MinPlayers | int | Минимален брой играчи |
  | MaxPlayers | int | Максимален брой играчи |
  | DifficultyLevel | string (max 20) | Easy / Medium / Hard / Expert |
  | PlayTimeMinutes | int | Примерно време (мин) |
  | Condition | string (max 20) | Състояние на играта |
  | PricePerHour | double | Цена на час |
  | IsAvailable | bool | Наличност |
  | ImageUrl | string (max 255) | Снимка |
  | Description | string (max 500) | Описание |
  | AddedAt | DateTime | Дата на добавяне |

  ### `CafeTables`
  | Колона | Тип | Описание |
  |--------|-----|---------|
  | Id | int (PK) | Идентификатор |
  | TableNumber | int | Номер на масата (уникален) |
  | Capacity | int | Капацитет |
  | IsVIP | bool | VIP маса |
  | HourlyRate | double | Цена на час |
  | Status | string (max 20) | Available / Occupied / Reserved / Maintenance |
  | LocationZone | string (max 50) | Зона в кафето |
  | Description | string (max 200) | Описание |

  ### `Reservations`
  | Колона | Тип | Описание |
  |--------|-----|---------|
  | Id | int (PK) | Идентификатор |
  | UserId | int (FK) | Потребител |
  | TableId | int (FK) | Маса |
  | BoardGameId | int? (FK) | Настолна игра (опционална) |
  | ReservationDate | DateTime | Дата |
  | StartTime | TimeSpan | Начален час |
  | EndTime | TimeSpan | Краен час |
  | PartySize | int | Брой хора |
  | TotalCost | double | Обща цена |
  | Status | string (max 20) | Confirmed / Pending / Cancelled |
  | Notes | string (max 500) | Бележки |
  | CreatedAt | DateTime | Дата на създаване |

  ---

  ## Изисквания

  - [.NET 9 SDK](https://dotnet.microsoft.com/download)
  - [Node.js 18+](https://nodejs.org)
  - SQL Server (MSSQLLocalDB) — включен с Visual Studio

  ---

  ## Инсталация и стартиране

  ### 1. Back-end (API)

  ```bash
  cd BoardGameCafe.API
  dotnet run

  API стартира на http://localhost:5180
  Swagger UI: http://localhost:5180/swagger

  ▎ Базата данни и seed данните се създават автоматично при първото стартиране.

  Admin акаунт по подразбиране:
  - Email: admin@boardgamecafe.com
  - Password: Admin123!

  2. Front-end (React SPA)

  cd boardgamecafe-client
  npm install
  npm run dev

  Приложението стартира на http://localhost:5173

  ---
  API Endpoints

  ┌────────┬────────────────────────┬──────────┬──────────────────────────────────────────────────┐
  │ Метод  │        Endpoint        │  Достъп  │                     Описание                     │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ POST   │ /api/auth/register     │ Public   │ Регистрация                                      │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ POST   │ /api/auth/login        │ Public   │ Вход                                             │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ GET    │ /api/boardgames        │ Public   │ Списък с игри (филтриране, сортиране, пагинация) │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ GET    │ /api/boardgames/{id}   │ Public   │ Детайли за игра                                  │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ POST   │ /api/boardgames        │ Admin    │ Добавяне                                         │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ PUT    │ /api/boardgames/{id}   │ Admin    │ Редактиране                                      │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ DELETE │ /api/boardgames/{id}   │ Admin    │ Изтриване                                        │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ GET    │ /api/tables            │ Public   │ Списък с маси                                    │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ GET    │ /api/tables/{id}       │ Public   │ Детайли за маса                                  │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ POST   │ /api/tables            │ Admin    │ Добавяне                                         │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ PUT    │ /api/tables/{id}       │ Admin    │ Редактиране                                      │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ DELETE │ /api/tables/{id}       │ Admin    │ Изтриване                                        │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ GET    │ /api/reservations      │ Admin    │ Всички резервации                                │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ GET    │ /api/reservations/my   │ Customer │ Моите резервации                                 │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ GET    │ /api/reservations/{id} │ Auth     │ Детайли                                          │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ POST   │ /api/reservations      │ Auth     │ Нова резервация                                  │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ PUT    │ /api/reservations/{id} │ Auth     │ Редактиране (смяна на статус: само Admin)        │
  ├────────┼────────────────────────┼──────────┼──────────────────────────────────────────────────┤
  │ DELETE │ /api/reservations/{id} │ Auth     │ Изтриване                                        │
  └────────┴────────────────────────┴──────────┴──────────────────────────────────────────────────┘

  ---
  Функционалности

  - JWT автентикация с роли (Admin / Customer)
  - Пълни CRUD операции за всеки модел
  - Филтриране по два критерия за всяка колекция
  - Сортиране и пагинация на всички списъци
  - Централизирана обработка на грешки (RFC 7807 Problem Details)
  - Валидация на входящи данни (DataAnnotations)
  - Автоматична проверка за конфликти при резервации
  - Изчисляване на цената според часове × тарифа на масата
  - Seed данни при първо стартиране
  - React SPA (Single Page Application) с React Router
