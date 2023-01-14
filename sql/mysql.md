```sql
with auction as (select * from `ss_auctions` where auction_id = 633)
, buyer as (select buyer_id from `ss_auctions_bids` join `ss_users` on ss_users.user_id = ss_auction_bids.buyer_id where auction_id = 633 and later_flag = 0 and ss_auction_bids.deleted_at is null group by buyer_id)
, buyer_past_bids as (select ss_auction_bids.* from `buyers` left join `ss_auction_bids` on ss_auction_bids.buyer_id = buyers.buyer_id where later_flag = 0 and ss_auction_bids.deleted_at is null)
, seller_past_auctions as (select * from `ss_auctions` where ss_auctions.user_id = (select user_id from `auction`) and ss_auctions.deleted_at is null)
```
