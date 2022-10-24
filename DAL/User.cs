namespace Models
{
    public class User : BaseModel
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string SecondName { get; set; }
    }
}
