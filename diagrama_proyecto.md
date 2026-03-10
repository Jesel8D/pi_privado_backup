graph TD
    A[pi_privado_backup] --> B[backend]
    A --> C[frontend]
    A --> D[database]
    A --> E[devops]
    A --> F[docs]
    A --> G[soa-skill]

    B --> B1[src]
    B --> B2[dist]
    B --> B3[node_modules]
    B --> B4[package.json]

    B1 --> B11[main.ts]
    B1 --> B12[app.module.ts]
    B1 --> B13[config]
    B1 --> B14[modules]

    B14 --> B141[auth]
    B14 --> B142[users]
    B14 --> B143[products]
    B14 --> B144[inventory]
    B14 --> B145[sales]
    B14 --> B146[orders]
    B14 --> B147[dashboard]
    B14 --> B148[reports]
    B14 --> B149[break-even]
    B14 --> B150[forecast]
    B14 --> B151[expiration]
    B14 --> B152[audit]
    B14 --> B153[benchmarking]

    C --> C1[src]
    C --> C2[.next]
    C --> C3[node_modules]
    C --> C4[package.json]
    C --> C5[public]

    C1 --> C11[app]
    C1 --> C12[components]
    C1 --> C13[lib]
    C1 --> C14[styles]
    C1 --> C15[types]

    D --> D1[init]
    D --> D2[migrations]
    D --> D3[scripts]

    D1 --> D11[01-init-extensions.sql]
    D1 --> D12[02-init-roles.sql]
    D1 --> D13[03-run-all-migrations.sh]

    D2 --> D21[V001__create_users.sql]
    D2 --> D22[V002__create_products.sql]
    D2 --> D23[V009__align_financial_domain.sql]

    E --> E1[docker]
    E --> E2[scripts]
    E --> E3[monitoring]

    E1 --> E11[backend/Dockerfile]
    E1 --> E12[frontend/Dockerfile]
    E1 --> E13[database/Dockerfile]
    E1 --> E14[nginx/Dockerfile]

    F --> F1[BENCHMARKING_REQUIREMENTS.md]
    F --> F2[BREAK_EVEN_ANALYSIS.md]
    F --> F3[DASHBOARD_REQUIREMENTS.md]
    F --> F4[USER_MANAGEMENT.md]

    G --> G1[src]
    G --> G2[soa-config.json]
    G --> G3[package.json]

    G1 --> G11[agents]
    G1 --> G12[tools]
    G1 --> G13[utils]

    H[Docker Services] --> H1[Frontend:8080]
    H --> H2[Backend:3001]
    H --> H3[PostgreSQL:5432]
    H --> H4[MongoDB:27017]
    H --> H5[Nginx:80]

    style A fill:#e1f5fe
    style H fill:#f3e5f5

    subgraph "Arquitectura SOA"
    H
    end
