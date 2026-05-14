using WORK.Entities.WORK;

namespace WORK.Rpc.heads_up.DTO;

public class HeadsUp_HeadsUpDTO : DataDTO
{
    public long Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public long CreatorId { get; set; }
    public bool IsRequestAcknowledgment { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public HeadsUpStatus HeadsUpStatus { get; set; }
    public HeadsUp_AppUserDTO Creator { get; set; }
    public List<HeadsUp_HeadsUpReactionDTO> Reactions { get; set; }
    public List<HeadsUp_AppUserDTO> AppUsers { get; set; }
    public List<HeadsUp_SiteDTO> Sites { get; set; }
    public List<HeadsUp_AppUserGroupDTO> AppUserGroups { get; set; }
    public List<HeadsUp_FileDTO> Files { get; set; }
    
    public int ViewCount { get; set; }
    public int AcknowledgeCount { get; set; }

    public HeadsUp_HeadsUpDTO() { }
    
    public HeadsUp_HeadsUpDTO(HeadsUp headsUp)
    {
        Id = headsUp.Id;
        Title = headsUp.Title;
        Description = headsUp.Description;
        CreatorId = headsUp.CreatorId;
        CreatedAt = headsUp.CreatedAt;
        UpdatedAt = headsUp.UpdatedAt;
        IsRequestAcknowledgment = headsUp.IsRequestAcknowledgment;
        HeadsUpStatus = headsUp.HeadsUpStatus;
        Reactions = headsUp.Reactions?.Select(r => new HeadsUp_HeadsUpReactionDTO(r)).ToList();
        Creator = headsUp.Creator == null ? null : new HeadsUp_AppUserDTO(headsUp.Creator);
        AppUsers = headsUp.AppUsers?.Select(x => new HeadsUp_AppUserDTO(x)).ToList();
        Sites = headsUp.Sites?.Select(x => new HeadsUp_SiteDTO(x)).ToList();
        AppUserGroups = headsUp.AppUserGroups?.Select(x => new HeadsUp_AppUserGroupDTO(x)).ToList();
        Files = headsUp.Files?.Select(x => new HeadsUp_FileDTO(x)).ToList();
        ViewCount = headsUp.ViewCount;
        AcknowledgeCount = headsUp.AcknowledgeCount;
        Errors = headsUp.Errors;
    }

    public HeadsUp ToEntity(ICurrentContext CurrentContext)
    {
        return new HeadsUp
        {
            Id = Id,
            Title = Title,
            Description = Description,
            CreatorId = CreatorId,
            IsRequestAcknowledgment = IsRequestAcknowledgment,
            HeadsUpStatus = HeadsUpStatus,
            AppUserGroups = AppUserGroups?.Select(x => x.ToEntity(CurrentContext)).ToList(),
            AppUsers = AppUsers?.Select(x => x.ToEntity(CurrentContext)).ToList(),
            Sites = Sites?.Select(x => x.ToEntity(CurrentContext)).ToList(),
            Files = Files?.Select(x => x.ToEntity(CurrentContext)).ToList(),
            Reactions = Reactions?.Select(x => x.ToEntity(CurrentContext)).ToList(),
            CreatedAt = CreatedAt,
            UpdatedAt = UpdatedAt,
            BaseLanguage = CurrentContext.Language
        };
    }
}

public class HeadsUp_HeadsUpFilterDTO : FilterDTO
{
    public IdFilter Id { get; set; }
    public IdFilter CreatorId { get; set; }
    public IdFilter AppUserId { get; set; }
    public IdFilter SiteId { get; set; }
    public IdFilter AppUserGroupId { get; set; }
    public string Search { get; set; }
    public DateFilter CreatedAt { get; set; }
    public HeadsUpOrder OrderBy { get; set; }

    public HeadsUpFilter ToFilterEntity()
    {
        return new HeadsUpFilter
        {
            Skip = Skip,
            Take = Take,
            OrderBy = HeadsUpOrder.CreatedAt,
            OrderType = OrderType.DESC,
            Id = Id,
            CreatorId = CreatorId,
            AppUserId = AppUserId,
            SiteId = SiteId,
            AppUserGroupId = AppUserGroupId,
            Search = Search,
            CreatedAt = CreatedAt
        };
    }
}