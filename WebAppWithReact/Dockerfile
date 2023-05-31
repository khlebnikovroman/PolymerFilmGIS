#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
#RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
#RUN apt-get install -y nodejs
COPY ["WebAppWithReact/WebAppWithReact.csproj", "WebAppWithReact/"]
COPY ["DAL/DAL.csproj", "DAL/"]
RUN dotnet restore "WebAppWithReact/WebAppWithReact.csproj"
COPY . .
WORKDIR "/src/WebAppWithReact"

RUN dotnet build "WebAppWithReact.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WebAppWithReact.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebAppWithReact.dll"]