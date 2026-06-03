using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BoardGameCafe.API.Migrations
{
    /// <inheritdoc />
    public partial class AddFullDescriptionToBoardGame : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FullDescription",
                table: "BoardGames",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FullDescription",
                table: "BoardGames");
        }
    }
}
